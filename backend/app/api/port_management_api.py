from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.app.core.force_port_close import kill_udp_process, logger

close_port_router = APIRouter()

class PortRequest(BaseModel):
    port: int
    address: str | None = None


@close_port_router.post("/closeport")
async def close_port(req: PortRequest):
    try:
        logger.debug(f"Received request to close port {req.port}")
        result = kill_udp_process(req.port, req.address)

        if result["success"]:
            return JSONResponse(
                status_code=200,
                content={"message": result["message"]}
            )
        else:
            return JSONResponse(
                status_code=400,
                content={"message": result["message"]}
            )

    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"Server error: {str(e)}"}
        )
