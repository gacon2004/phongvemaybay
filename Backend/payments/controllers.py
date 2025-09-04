import os, time, secrets, json, httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from Backend.database.connector import DatabaseConnector
from .models import Bank_informayion
import re
import uuid
from Backend.payments.models import (
    CreateOrderOut
)
# ENV
SEPAY_BANK_ACCOUNT_ID = os.getenv("SEPAY_BANK_ACCOUNT_ID")
SEPAY_TOKEN = os.getenv("SEPAY_TOKEN")
SEPAY_WEBHOOK_SECRET = os.getenv("SEPAY_WEBHOOK_SECRET")

db = DatabaseConnector()

def _gen_order_code() -> str:
    # ví dụ: APPT-123-250812-AB12
    return f"ThanhToan{time.strftime('%y%m%d')}{secrets.token_hex(2).upper()}"

async def create_payment_order(price : int ) -> CreateOrderOut:
    sql_insert_query = """
    INSERT INTO `Payments` (
        `payment_order_id`, `order_code`, `amount`, `status`,
        `account_number`, `bank_name`, `virtual_account_number`, `qr_code_url`
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    payment_id_to_insert = str(uuid.uuid4()) 
    oder_code =_gen_order_code()
    

    bank_if = db.query_get("""
        SELECT a.account_number, a.bank_name, a.va
        FROM bank_information a
    """, ())
    if not bank_if:
        raise HTTPException(404, "bank information not found")
    bank_if = bank_if[0]

    account_number = bank_if["account_number"]
    bank_name = bank_if["bank_name"]
    va = bank_if["va"]

    qr_code_url = f"https://qr.sepay.vn/img?acc={account_number}&bank={bank_name}&amount={price}&des={oder_code}"
    payment_data = (
        payment_id_to_insert, # payment_order_id
        oder_code,                   # order_code
        price,                           # amount
        'AWAITING',                           # status
        account_number,                         # account_number
        bank_name,              # bank_name
        va,                       # virtual_account_number
        qr_code_url # qr_code_url
    )
    db.query_put(sql_insert_query,payment_data)

    return {
        "payment_order_id": payment_id_to_insert,
        "stk": account_number,
        "bank": bank_name,
        "order_code": oder_code,
        "amount_vnd": price,
        "status": "AWAITING",
        "va_number": va,
        "qr_code_url": qr_code_url,
    }

def get_payment_order_by_code(oder_code : str):
    bank_if = db.query_get("""
        SELECT a.account_number, a.bank_name, a.va
        FROM bank_information a
    """, ())
    return null
def _json_dumps(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))

def verify_webhook_auth(Authorization: Optional[str]):
    print(f"Authorization header received: '{Authorization}'") # Thêm dòng này vào
    if not Authorization or not Authorization.lower().startswith("apikey "):
        raise HTTPException(401, "Missing Apikey")
    key = Authorization.split(" ", 1)[1]
    if key != SEPAY_WEBHOOK_SECRET:
        raise HTTPException(401, "Invalid Apikey")


def extract_order_code_from_content(content: str) -> Optional[str]:
    """
    Trích xuất mã đơn hàng (có dạng 'APPT...') từ chuỗi nội dung.
    """
    if not content:
        return None
    # Regex tìm chuỗi bắt đầu bằng 'APPT' và theo sau là chữ cái hoặc số
    pattern = r"APPT[A-Z0-9]+"
    match = re.search(pattern, content)
    if match:
        return match.group(0)
    return None

def handle_sepay_webhook(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Xử lý webhook biến động/VA: idempotent + map về payment_orders bằng code.
    """
    tx_id = payload.get("id")
    if tx_id is None:
        raise HTTPException(400, "Missing id")

    # 1) Idempotent
    existed = db.query_get("SELECT id FROM payment_events WHERE sepay_tx_id=%s", (tx_id,))
    if existed:
        return {"success": "da thanh toan"}

    code = payload.get("code")           # với VA theo đơn hàng = order_code
    amount = int(payload.get("transferAmount") or 0)
    ttype  = payload.get("transferType") # 'in'/'out'
    content = payload.get("content")

    order_code = extract_order_code_from_content(content)

    # 3) Map về payment_orders và cập nhật trạng thái
    if ttype == "in":
        # Lock nhẹ bằng update có điều kiện trạng thái
        rows = db.query_get("""
            SELECT id, amount_vnd, status FROM payment_orders WHERE order_code=%s
        """, (order_code,))
        if rows:
            po = rows[0]
            if po["status"] in ("PENDING", "AWAITING"):
                if amount >= po["amount_vnd"]:
                    db.query_put("""
                        UPDATE payment_orders
                        SET status='PAID', paid_at=NOW()
                        WHERE id=%s
                    """, (po["id"],))
                elif 0 < amount < po["amount_vnd"]:
                    db.query_put("UPDATE payment_orders SET status='PARTIALLY' WHERE id=%s", (po["id"],))
    else:
        return {"success": "khong co code"}

    return {"success": True}

def update_bank_account(bank_account : Bank_informayion ):
    result = db.query_put("""
        UPDATE bank_information
        SET bank_name = %s, va = %s, account_number = %s
        WHERE id = 1;
    """, (bank_account.bank_name, bank_account.va, bank_account.account_number,))
    if result == 0:
        return "erorr"
    return "update_sucess"

def get_bank_information():
    result = db.query_get("""
        SELECT account_number, bank_name, va
        FROM bank_information
        WHERE id = 1;
    """, ())
    if not result :
        return "erorr"
    return result