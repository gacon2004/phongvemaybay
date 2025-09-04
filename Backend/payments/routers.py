from fastapi import APIRouter, HTTPException, Header, Request, Depends, status
from .models import CreateOrderIn, CreateOrderOut, PaymentOrderOut, Bank_informayion
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .controllers import (
    create_payment_order,
    get_payment_order_by_code,
    verify_webhook_auth,
    handle_sepay_webhook,
    update_bank_account,
    get_bank_information
)

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/orders", response_model=CreateOrderOut)
async def create_order(
    price :int 
):
    return await create_payment_order(price)

@router.get("/orders/{order_code}", response_model=PaymentOrderOut)
def get_order(
    order_code: str
):
    data = get_payment_order_by_code(
        order_code=order_code
    )
    if not data:
        raise HTTPException(status_code=404, detail="Order not found")
    return data

# Webhook từ SePay (money-in)
@router.post("/webhooks/sepay")
async def sepay_webhook(request: Request, Authorization: str = Header(None)):
    verify_webhook_auth(Authorization)
    payload = await request.json()
    return handle_sepay_webhook(payload)

@router.put("/bank_information")
async def update_bank(
    bank_if : Bank_informayion
    ):
    return update_bank_account(bank_if)

@router.get("/bank_information", response_model=Bank_informayion)
async def get_bank():
    bank = get_bank_information()
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(bank))