from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/users", tags=["Users & Monetization"])

@router.get("/{user_id}", summary="Получить профиль, статус и рекламные кредиты")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return {
        "id": user.id,
        "phone": user.phone,
        "name": user.name,
        "bin_iin": user.bin_iin,
        "is_verified": user.is_verified,          # Синяя галочка (Verified Vendor)
        "partner_status": user.partner_status,    # standard, app_partner, friend_of_company
        "ad_credits": user.ad_credits,            # Баланс рекламных пакетов
        "created_at": user.created_at
    }
