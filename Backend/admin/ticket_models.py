from pydantic import BaseModel
from typing import Optional
from datetime import datetime



class info(BaseModel) :
    id : Optional[int] = None
    name:str
    sdt: str
    chuyenbay: str
    price: int