from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    
    # Роли и статусы верификации
    is_verified_vendor = Column(Boolean, default=False)  # Галочка «Проверенный поставщик» (после ручной проверки админом)
    user_type = Column(String, default="user")          # user (фермер), partner (партнер), friend (друг компании)
    paid_ads_balance = Column(Integer, default=0)        # Лимит/остаток объявлений в пакете (5, 10, 20)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    ads = relationship("Advertisement", back_populates="owner")

class Advertisement(Base):
    __tablename__ = "advertisements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)      # Название (например: Трактор МТЗ-82)
    category = Column(String, index=True, nullable=False)  # Техника, Семена, Шины, Оборудование, Услуги
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)                  # Цена в тенге
    region = Column(String, index=True, nullable=False)    # Регион (Костанайская обл. и т.д.)
    photo_url = Column(String, nullable=True)
    status = Column(String, default="active")              # active, sold, blocked
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="ads")
