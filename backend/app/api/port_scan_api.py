from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..scanner.port_scan import scan_ports as scan_tcp_ports
from ..scanner.port_scan_udp import scan_ports as scan_udp_ports

get_open_ports = APIRouter()

class ScanRequest(BaseModel):
    address: str

@get_open_ports.post("/scanports")
def port_scan(request: ScanRequest):
    try:
        # Run both TCP and UDP scans
        tcp_result = scan_tcp_ports(request.address)
        udp_result = scan_udp_ports(request.address)

        # Combine the results
        result = {
            "tcp": tcp_result,
            "udp": udp_result
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))