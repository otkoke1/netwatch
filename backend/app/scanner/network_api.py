from fastapi import APIRouter
from backend.app.core.subnet_sniffing import get_local_subnet, get_local_ip, get_gateway_ip, get_gateway_mac

get_subnet = APIRouter()

@get_subnet.get("/networkinfo")
def scan_subnet():
    try:
        subnet = str(get_local_subnet())
        local_ip = str(get_local_ip())
        gateway_ip = str(get_gateway_ip())
        gateway_mac = str(get_gateway_mac(gateway_ip)) if gateway_ip else None

        return {
            "subnet": subnet,
            "local_ip": local_ip,
            "gateway_ip": gateway_ip,
            "gateway_mac": gateway_mac
        }
    except Exception as e:
        return {"error": str(e)}

@get_subnet.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    print(scan_subnet())