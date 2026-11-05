from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False, default="12345") # Пароль для входа
    user_type = Column(String, default="individual") # "individual" (Физ. лицо / КХ) или "company" (Юр. лицо / ТОО)
    name = Column(String, nullable=True)             # ФИО или Название компании
    bin_iin = Column(String, nullable=True)          # ИИН или БИН (12 цифр)
    avatar_url = Column(String, nullable=True)       # Ссылка на аватарку / логотип
    
    is_verified = Column(Boolean, default=False)     # Статус Verified Vendor (синяя галочка)
    ad_credits = Column(Integer, default=0)          # Рекламный баланс
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связь с объявлениями пользователя
    ads = relationship("Ad", back_populates="owner", cascade="all, delete-orphan")


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    location = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)
    image_url = Column(String, nullable=True)        # Ссылка на фото объекта (техника, ангар)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Обратная связь с пользователем
    owner = relationship("User", back_populates="ads")
