from fastapi import APIRouter
from backend.app.core.speed_check import test_internet_speed

get_speed = APIRouter()

@get_speed.get("/speedtest")
def speed_test():
    try:
        speed_result = test_internet_speed()
        return {
            "ping": speed_result["ping"],
            "download": speed_result["download"],
            "upload": speed_result["upload"]
        }
    except Exception as e:
        return {"error": str(e)}
