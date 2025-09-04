from Backend.database.connector import DatabaseConnector
from Backend.client.vemaybay_model import (
    Payment_infor_model
)

conn = DatabaseConnector()
def post_payment(payment_model : Payment_infor_model):
    
    return "helolo"