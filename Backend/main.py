from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Backend.auth.auth_routers import router as auth_router
from dotenv import load_dotenv
import os


load_dotenv()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from Backend.client.vemaybay_router import router as vemaybay_router
from Backend.payments.routers import router as payment_router
from Backend.admin.ticket_routers import router as admin_router
app = FastAPI(
    title="Example API",
    description="This is an example API of FastAPI",
    contact={
        "name": "Minh",
        "email": "masaki.yoshiiwa@gmail.com",
    },
    docs_url="/v1/docs",
    redoc_url="/v1/redoc",
    openapi_url="/v1/openapi.json",
)

@app.get("/")
def root():
    return {"message": "heloo"}
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4000",
    "http://localhost:19006",
    "https://kiosk-lyart.vercel.app"
]

# Set middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(vemaybay_router)
app.include_router(payment_router)
app.include_router(admin_router)
app.include_router(auth_router)