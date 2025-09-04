from Backend.database.connector import DatabaseConnector
from Backend.client.vemaybay_model import (
    Payment_infor_model
)
import httpx

conn = DatabaseConnector()
def post_payment(payment_model : Payment_infor_model):
    
    return "helolo"

async def search_flights(payload: dict):
    # URL của API bên thứ ba
    external_api_url = "https://phongvemaybay247.com/search"

    async with httpx.AsyncClient() as client:
        # Gửi yêu cầu POST đến API bên ngoài với payload từ frontend
        response = await client.post(external_api_url, json=payload)
        response.raise_for_status() 

        # Trả về dữ liệu JSON từ API bên ngoài
        return response.json()