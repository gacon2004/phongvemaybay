from fastapi import APIRouter, Depends, status, Query, Path, HTTPException, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Annotated, List

from Backend.client.vemaybay_controller import(
    post_payment
)
from Backend.client.vemaybay_model import(
    Payment_infor_model
)



router = APIRouter(prefix="/api", tags=["api"])
@router.post("/payment-info", response_model=Payment_infor_model)
def post_payment_info(payment_model : Payment_infor_model):
    detail = post_payment(payment_model)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=jsonable_encoder(detail))