from fastapi import APIRouter, HTTPException, Header, Request, Depends, status
from .ticket_models import info
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .ticket_controllers import getall_info,create_infomation, delete_infomation,get_info
from typing import List

router = APIRouter(prefix="/info", tags=["infomation"])
@router.get("/full_infomation", response_model=List[info])
def getall_infomation():
    data = getall_info()
    if not data:
        raise HTTPException(status_code=404, detail="info not found")
    return data

@router.get("/infomation",response_model=info )
def get_infomation(id):
    data = get_info(id)
    if not data:
        raise HTTPException(status_code=404, detail="info not found")
    return data[0]

@router.post("/infomation",response_model= str)
def post_info(info : info):
    update= create_infomation(info)
    if update == 0:
        return "error"
    return "success"

@router.post("/delete_infomation",response_model= str)
def delete_info(id : int):
    delete = delete_infomation(id)
    if delete == 0:
        return "erorr"
    return "succcess"