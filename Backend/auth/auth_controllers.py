from typing import Dict, Any
from fastapi import HTTPException, status
from Backend.database.connector import DatabaseConnector
from .auth_models import LoginIn

def _db():
    # Khởi tạo khi dùng để tránh crash nếu env thiếu lúc import
    return DatabaseConnector()

def login_plain(payload: LoginIn) -> Dict[str, Any]:
    db = _db()
    row = db.query_one(
        "SELECT id, username, password, full_name, role, is_active "
        "FROM users WHERE username=%s LIMIT 1",
        (payload.username,),
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai tài khoản hoặc mật khẩu")
    if not row["is_active"]:  # BIT(1) -> bool nhờ converter trong connector
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản bị khóa")
    if payload.password != row["password"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai tài khoản hoặc mật khẩu")

    return {
        "id": row["id"],
        "username": row["username"],
        "full_name": row["full_name"],
        "role": row["role"],
    }
