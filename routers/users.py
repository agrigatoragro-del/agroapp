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

@router.post("/")
def register_or_login(
    phone: str = Form(...),
    password: str = Form(...),
    user_type: str = Form("individual"),
    name: str = Form(""),
    bin_iin: str = Form(""),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if user:
        if user.password != password:
            raise HTTPException(status_code=400, detail="Неверный пароль")
        return user
    
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
    return new_user

# Эндпоинт для сбора статистики в админ-панель
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

@router.post("/{user_id}/avatar")
async def upload_avatar(user_id: int, avatar: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    os.makedirs("static/uploads", exist_ok=True)
    file_path = f"static/uploads/avatar_{user_id}_{avatar.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(avatar.file, buffer)
    
    user.avatar_url = f"/{file_path}"
    db.commit()
    return {"avatar_url": user.avatar_url}

@router.post("/{user_id}/change-password")
def change_password(
    user_id: int,
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.password != old_password:
        raise HTTPException(status_code=400, detail="Старый пароль введен неверно")
    user.password = new_password
    db.commit()
    return {"status": "success"}
