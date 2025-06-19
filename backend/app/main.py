import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.connected_devices import connected_devices_router
from backend.app.api.network_api import get_subnet
from backend.app.api.speed_test_api import get_speed


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(get_subnet, prefix="/api")

app.include_router(get_speed, prefix="/api")
app.include_router(connected_devices_router, prefix="/api")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)



