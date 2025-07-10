from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..scanner.port_scan import scan_ports

get_open_ports = APIRouter()

class ScanRequest(BaseModel):
    address: str

@get_open_ports.post("/scanports")
def port_scan(request: ScanRequest):
    try:
        result = scan_ports(request.address)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
