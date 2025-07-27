# backend/app/api/port_management_api.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from backend.app.core.force_port_close import kill_udp_process

close_port_router = APIRouter()


@close_port_router.post("/closeport")
async def close_port():
    """Endpoint to close UDP port 9999"""
    try:
        result = kill_udp_process()

        if not result["success"]:
            return JSONResponse(
                status_code=500,
                content={"detail": result["message"]}
            )

        return JSONResponse(
            status_code=200,
            content={"message": result["message"]}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )