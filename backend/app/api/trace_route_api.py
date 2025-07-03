from fastapi import APIRouter, HTTPException
from backend.app.core.trace_route import traceroute

get_traceroute_router = APIRouter()

@get_traceroute_router.get("/traceroute")
def run_traceroute(target: str, max_hops: int = 30):
    if not target:
        raise HTTPException(status_code=400, detail="Target host is required")
    return traceroute(target, max_hops)