from fastapi import APIRouter
from .auth_models import LoginIn, UserOut
from .auth_controllers import login_plain

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(payload: LoginIn):
    user = login_plain(payload)
    return {"ok": True, "user": user}
