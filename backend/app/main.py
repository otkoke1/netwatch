import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.connected_devices import connected_devices_router
from backend.app.api.network_api import get_subnet
from backend.app.api.speed_test_api import get_speed
from backend.app.api.port_scan_api import get_open_ports
from backend.app.api.ping_test_api import get_ping_result
from backend.app.api.trace_route_api import get_traceroute_router
from contextlib import asynccontextmanager
import threading
from backend.app.api.realtime_api import realtime_router
from backend.app.core.rtscan_activity import start_sniffing, reset_protocol_stat
from backend.app.api.auth_router import auth_router
from backend.app.db.Database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    reset_protocol_stat()
    init_db()
    t = threading.Thread(target=start_sniffing, daemon=True)
    t.start()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173", "http://localhost:5172", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # Add this line to expose headers

)

app.include_router(get_subnet, prefix="/api")
app.include_router(get_speed, prefix="/api")
app.include_router(connected_devices_router, prefix="/api")
app.include_router(get_open_ports, prefix="/api")
app.include_router(get_ping_result, prefix="/api")
app.include_router(get_traceroute_router, prefix="/api")
app.include_router(realtime_router, prefix="/api")
app.include_router(auth_router, prefix="/api")




for route in app.routes:
    print(route.path)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)



