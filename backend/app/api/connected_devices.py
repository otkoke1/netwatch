from fastapi import FastAPI, APIRouter
from backend.app.scanner.arp_discorvery import live_host_discovery

connected_devices_router = APIRouter()

@connected_devices_router.get("/connected-devices")
def get_connected_devices():
    try:
        devices = live_host_discovery(verbose=False)
        total_devices = len(devices)
        return {
            "total_devices": total_devices,
            "devices": devices
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print(get_connected_devices())