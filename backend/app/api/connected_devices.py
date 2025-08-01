from fastapi import FastAPI, APIRouter
from backend.app.core.network_monitor import NetworkMonitor
from backend.app.scanner.arp_discorvery import live_host_discovery
from backend.app.core.subnet_sniffing import find_active_interface
import time

connected_devices_router = APIRouter()
network_monitor = NetworkMonitor()

# Get interface name once at startup
iface = find_active_interface()
network_monitor.start_monitoring(iface)  # Start monitoring immediately

@connected_devices_router.get("/connected-devices")
def get_connected_devices():
    try:
        devices = live_host_discovery(verbose=False)
        total_devices = len(devices)

        # Only restart monitoring if it stopped
        if not network_monitor.is_running:
            network_monitor.start_monitoring(iface)

        return {
            "total_devices": total_devices,
            "devices": devices
        }
    except Exception as e:
        return {"error": str(e)}

@connected_devices_router.get("/device-usage/{ip}")
def get_device_usage(ip: str):
    try:
        # Ensure monitoring is running
        if not network_monitor.is_running:
            iface = find_active_interface()
            network_monitor.start_monitoring(iface)

        stats = network_monitor.get_traffic_stats(ip)
        if not stats:
            return {
                "status": "success",
                "data": {
                    "bytes_sent": 0,
                    "bytes_received": 0,
                    "packets_sent": 0,
                    "packets_received": 0,
                    "bandwidth_sent": 0,
                    "bandwidth_received": 0
                }
            }
        return {"status": "success", "data": stats}
    except Exception as e:
        return {"status": "error", "message": str(e)}