from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.app.core.ping_test import ping_test, local_network_info

class PingRequest(BaseModel):
    host: str
    is_internal: Optional[bool] = False

get_ping_result = APIRouter()

@get_ping_result.post("/pingresult")
async def perform_ping_test(request: PingRequest):
    try:
        result = ping_test(request.host)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@get_ping_result.get("/networkinfo")
async def get_network_info():
    try:
        return local_network_info()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))