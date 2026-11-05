from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api", tags=["Agro Marketplace"])

# Pydantic схемы для валидации входящих данных
class UserCreate(BaseModel):
    phone: str
    name: Optional[str] = None
    bin_iin: Optional[str] = None
    email: Optional[str] = None

class AdCreate(BaseModel):
    title: str
    category: str
    description: str
    price: float
    location: str = "Костанай"
    user_id: int

# 1. Регистрация или вход пользователя по номеру телефона
@router.post("/users/", summary="Регистрация пользователя по телефону")
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.phone == user_data.phone).first()
    if existing_user:
        return {"message": "Пользователь с таким номером уже существует", "user_id": existing_user.id}
    
    new_user = models.User(
        phone=user_data.phone,
        name=user_data.name,
        bin_iin=user_data.bin_iin,
        email=user_data.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Пользователь успешно зарегистрирован", "user_id": new_user.id}

# 2. Создание нового объявления
@router.post("/ads/", summary="Создать объявление (техника, ангары и т.д.)")
def create_ad(ad_data: AdCreate, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь
    user = db.query(models.User).filter(models.User.id == ad_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, dtype="string", detail="Пользователь не найден")
    
    new_ad = models.Ad(
        title=ad_data.title,
        category=ad_data.category,
        description=ad_data.description,
        price=ad_data.price,
        location=ad_data.location,
        user_id=ad_data.user_id
    )
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    return {"message": "Объявление успешно создано", "ad_id": new_ad.id}

# 3. Получение списка всех объявлений
@router.get("/ads/", summary="Получить список всех объявлений")
def get_ads(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    ads = db.query(models.Ad).filter(models.Ad.is_active == True).offset(skip).limit(limit).all()
    return ads
