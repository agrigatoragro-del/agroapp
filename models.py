from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False, default="12345")
    user_type = Column(String, default="individual") # "individual" или "company"
    name = Column(String, nullable=True)
    bin_iin = Column(String, nullable=True)          # БИН заполняется только для ТОО
    avatar_url = Column(String, nullable=True)
    
    is_verified = Column(Boolean, default=False)     # Синяя галочка (Verified Vendor)
    is_admin = Column(Boolean, default=False)        # Права администратора
    ad_credits = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    ads = relationship("Ad", back_populates="owner", cascade="all, delete-orphan")


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    location = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)
    
    is_approved = Column(Boolean, default=False)     # Модерация: False — ждет проверки, True — опубликовано
    images_json = Column(Text, nullable=True)        # Массив до 10 фотографий в JSON
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="ads")
