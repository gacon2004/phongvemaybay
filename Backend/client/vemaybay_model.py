
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional

class Payment_infor_model(BaseModel):
    isEnabled: bool
    bank: str
    accountName: str
    accountNumber: int
    qrCodeUrl: str

