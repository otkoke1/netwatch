from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from backend.app.core.auth import authenticate_user, create_access_token, decode_token
from backend.app.core.register import UserCreate, UserOut
from sqlalchemy.orm import Session
from backend.app.db.Database import get_db
from backend.app.core.security import get_password_hash
from backend.app.db.models import User
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from backend.app.core.pdf_generator import generate_lan_report
from backend.app.api.connected_devices import get_connected_devices
from backend.app.api.network_api import get_subnet
from backend.app.core.speed_check import test_internet_speed
from backend.app.core.subnet_sniffing import get_local_subnet, get_local_ip, get_gateway_ip

auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class Token(BaseModel):
    access_token: str
    token_type: str

class CurrentUser(BaseModel):
    username: str

class UserProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None


@auth_router.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Extract remember_me from form_data, default to False
    remember_me = getattr(form_data, "remember_me", False)

    access_token = create_access_token(
        data={"sub": user["username"]},
        remember_me=remember_me
    )
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/auth/me", response_model=UserOut)  # Changed response model
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@auth_router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@auth_router.put("/auth/profile")
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    return {"message": "Profile updated successfully"}

@auth_router.delete("/auth/profile")
async def delete_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if user:
        db.delete(user)
        db.commit()
        return {"message": "Account deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")


@auth_router.get("/auth/download-lan-info")
async def download_lan_info(current_user: User = Depends(get_current_user)):
    try:
        # Get network information
        subnet = str(get_local_subnet())
        local_ip = str(get_local_ip())
        gateway_ip = str(get_gateway_ip())

        network_info = {
            "subnet": subnet,
            "local_ip": local_ip,
            "gateway_ip": gateway_ip,
        }

        # Get connected devices
        try:
            devices = await get_connected_devices()
        except Exception as e:
            print(f"Error getting devices: {str(e)}")
            devices = []

        # Get speed test results
        try:
            speed_result = test_internet_speed()
        except Exception as e:
            print(f"Error getting speed test: {str(e)}")
            speed_result = {
                "download": "N/A",
                "upload": "N/A",
                "ping": "N/A"
            }

        # Generate PDF
        try:
            pdf_buffer = generate_lan_report(
                user_data={"username": current_user.username},
                network_info=network_info,
                devices=devices,
                speed_test=speed_result
            )
        except Exception as e:
            print(f"Error generating PDF: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error generating PDF: {str(e)}"
            )

        filename = f"lan_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
                "Access-Control-Allow-Origin": "http://localhost:5174"
            }
        )
    except Exception as e:
        print(f"Error in download_lan_info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate report: {str(e)}"
        )
