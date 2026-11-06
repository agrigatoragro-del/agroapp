from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/api/users", tags=["users"])

# Регистрация пользователя
@router.post("/register")
def register_user(
    phone: str = Form(...),
    password: str = Form(...),
    name: str = Form(""),
    user_type: str = Form("individual"), # 'individual' или 'company'
    bin_iin: str = Form(""),
    db: Session = Depends(get_db)
):
    # Проверяем, есть ли уже такой номер в базе
    existing_user = db.query(models.User).filter(models.User.phone == phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким номером уже зарегистрирован!")
    
    # Если юридическое лицо, проверяем обязательность БИН
    if user_type == 'company' and not bin_iin.strip():
        raise HTTPException(status_code=400, detail="Для юридического лица обязательно укажите БИН!")

    new_user = models.User(
        phone=phone,
        password=password,
        name=name,
        user_type=user_type,
        bin_iin=bin_iin,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "message": "Регистрация успешна!", "user_id": new_user.id}

# Авторизация (Вход)
@router.post("/login")
def login_user(
    phone: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user or user.password != password:
        raise HTTPException(status_code=400, detail="Неверный телефон или пароль!")
    
    return {
        "id": user.id,
        "phone": user.phone,
        "name": user.name,
        "user_type": user.user_type,
        "bin_iin": user.bin_iin,
        "is_admin": user.is_admin
    }

# Экстренное назначение администратора (вызывается один раз через адресную строку)
@router.get("/make-me-admin-now")
def make_me_admin_now(phone: str = "87764777278", db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с таким номером не найден в базе")
    user.is_admin = True
    db.commit()
    return {"status": "success", "message": f"Пользователь {phone} успешно назначен администратором!"}

# Получение списка всех пользователей для админ-панели
@router.get("/admin/users-list")
def get_all_users_list(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "phone": u.phone,
            "name": u.name or "Без имени",
            "user_type": u.user_type,
            "bin_iin": u.bin_iin or "",
            "is_admin": u.is_admin
        })
    return result

# Переключение прав администратора для конкретного пользователя
@router.post("/admin/toggle-admin/{user_id}")
def toggle_admin_status(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user.is_admin = not user.is_admin
    db.commit()
    return {"status": "success", "is_admin": user.is_admin}

# Статистика для модератора
@router.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_ads = db.query(models.Ad).count()
    pending_ads = db.query(models.Ad).filter(models.Ad.is_approved == False).count()
    
    return {
        "total_users": total_users,
        "total_ads": total_ads,
        "pending_ads": pending_ads
    }
