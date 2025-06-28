from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.core.ping_test import ping_test

class PingRequest(BaseModel):
    host: str

get_ping_result = APIRouter()

@get_ping_result.post("/pingresult")
async def perform_ping_test(request: PingRequest):
    try:
        result = ping_test(request.host)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))