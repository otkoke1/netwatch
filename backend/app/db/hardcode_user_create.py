from backend.app.db.Database import SessionLocal
from backend.app.db.models import User
from passlib.context import CryptContext

# Khởi tạo session và bcrypt
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

username = "admin"
password = "admin123"

existing_user = db.query(User).filter_by(username=username).first()
if existing_user:
    db.delete(existing_user)
    db.commit()

hashed_password = pwd_context.hash(password)

new_user = User(username=username, hashed_password=hashed_password)

db.add(new_user)
db.commit()
db.close()

print("✅ Created user:", username)

