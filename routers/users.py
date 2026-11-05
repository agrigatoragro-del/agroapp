from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import User
import shutil
import os

router = APIRouter(prefix="/api/users", tags=["Users"])

UPLOAD_DIR = "static/uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Вход или регистрация по телефону и паролю
@router.post("/")
def login_or_register(
    phone: str = Form(...),
    password: str = Form(...),
    user_type: str = Form("individual"),
    name: str = Form(None),
    bin_iin: str = Form(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.phone == phone).first()
    
    if user:
        # Если пользователь уже есть — проверяем пароль
        if user.password != password:
            raise HTTPException(status_code=400, detail="Неверный пароль!")
        # Обновляем данные, если они переданы
        if name: user.name = name
        if bin_iin: user.bin_iin = bin_iin
        db.commit()
        db.refresh(user)
        return user
    
    # Если пользователя нет — регистрируем нового
    new_user = User(
        phone=phone,
        password=password,
        user_type=user_type,
        name=name,
        bin_iin=bin_iin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Смена пароля из личного кабинета
@router.post("/{user_id}/change-password")
def change_password(
    user_id: int,
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user.password != old_password:
        raise HTTPException(status_code=400, detail="Старый пароль указан неверно")
    
    user.password = new_password
    db.commit()
    return {"message": "Пароль успешно изменен"}

# Загрузка аватарки
@router.post("/{user_id}/avatar")
async def upload_avatar(
    user_id: int,
    avatar: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    file_path = os.path.join(UPLOAD_DIR, f"user_{user_id}_{avatar.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(avatar.file, buffer)
    
    avatar_url = f"/{file_path}"
    user.avatar_url = avatar_url
    db.commit()
    db.refresh(user)
    
    return {"avatar_url": avatar_url, "user": user}
