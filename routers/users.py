from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserCreate(BaseModel):
    phone: str
    user_type: str = "individual" # "individual" или "company"
    name: str = None
    bin_iin: str = None

@router.post("/")
def create_or_get_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Проверяем, есть ли уже пользователь с таким телефоном
    user = db.query(User).filter(User.phone == user_data.phone).first()
    
    if user:
        # Если есть — обновляем данные (на случай, если изменилось имя или тип)
        user.user_type = user_data.user_type
        user.name = user_data.name
        user.bin_iin = user_data.bin_iin
        db.commit()
        db.refresh(user)
        return user
    
    # Если нет — создаем нового
    new_user = User(
        phone=user_data.phone,
        user_type=user_data.user_type,
        name=user_data.name,
        bin_iin=user_data.bin_iin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
