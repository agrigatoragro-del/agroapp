from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import os
import shutil

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
@router.post("/register")
def register_user(
    phone: str = Form(...),
    password: str = Form(...),
    user_type: str = Form("individual"),
    name: str = Form(""),
    bin_iin: str = Form(""),
    db: Session = Depends(get_db)
):
    # Проверяем, есть ли уже такой номер в базе
    existing_user = db.query(models.User).filter(models.User.phone == phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким номером уже зарегистрирован!")
    
    new_user = models.User(
        phone=phone,
        password=password,
        user_type=user_type,
        name=name,
        bin_iin=bin_iin,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "message": "Регистрация прошла успешно!", "user_id": new_user.id}

# 2. ВХОД (АВТОРИЗАЦИЯ)
@router.post("/login")
def login_user(
    phone: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с таким номером не найден. Зарегистрируйтесь!")
    
    if user.password != password:
        raise HTTPException(status_code=400, detail="Неверный пароль!")
        
    return user

# Статистика для админ-панели
@router.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_ads = db.query(models.Ad).count()
    pending_ads = db.query(models.Ad).filter(models.Ad.is_approved == False).count()
    return {
        "total_users": total_users,
        "total_ads": total_ads,
        "pending_ads": pending_ads,
        "server_status": "Работает стабильно"
    }
