import os, time, secrets, json, httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from Backend.database.connector import DatabaseConnector
from .ticket_models import info
import re
import uuid


db = DatabaseConnector()

def getall_info() -> list[dict]:
    existed = db.query_get("SELECT * FROM infomation",())
    return existed

def get_info(id)  -> info:
    result = db.query_get("SELECT * FROM infomation WHERE id=%s",(id,))
    return result

def create_infomation(info: info):
    sql = """
        INSERT INTO infomation (name, sdt, chuyenbay, price)
        VALUES (%s, %s, %s, %s)
    """
    params = (info.name, info.sdt, info.chuyenbay, info.price)
    result = db.query_put(sql, params)
    return result
def delete_infomation(id: int):
    sql = "DELETE FROM infomation WHERE id = %s"
    params = (id,)
    return db.query_put(sql, params)
