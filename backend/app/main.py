import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.scanner.network_api import get_subnet


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(get_subnet)



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)



