from fastapi import APIRouter
from backend.app.core.subnet_sniffing import get_local_subnet
get_subnet = APIRouter()


@get_subnet.get("/subnet")
def scan_subnet():
    try:
        subnet = str(get_local_subnet())
        return {"subnet": subnet}
    except Exception as e:
        return {"error": str(e)}