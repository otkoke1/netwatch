from fastapi import APIRouter
from backend.app.core.rtscan_activity import get_protocol_stat

realtime_router = APIRouter()
print("[🔌] Realtime API Loaded")


@realtime_router.get("/realtime/protocol-stats")
def get_protocol_usage():
    return get_protocol_stat()
