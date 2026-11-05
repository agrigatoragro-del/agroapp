from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone = Column(String, unique=True, index=True, nullable=False)  # Основной логин по номеру телефона
    name = Column(String, nullable=True)  # ФИО или Название КХ/компании
    bin_iin = Column(String, nullable=True)  # БИН/ИИН (необязательно, только для юрлиц и КХ)
    email = Column(String, unique=True, index=True, nullable=True)
    
    # Синяя галочка и монетизация
    is_verified = Column(Boolean, default=False)  # Синяя галочка (Verified Vendor)
    partner_status = Column(String, default="standard")  # standard, app_partner, friend_of_company
    ad_credits = Column(Integer, default=0)  # Оплаченные пакеты объявлений
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связи
    ads = relationship("Ad", back_populates="owner", cascade="all, delete-orphan")
    verifications = relationship("VerificationRequest", back_populates="user", cascade="all, delete-orphan")

class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)  # Заголовок (например, "Бескаркасный ангар 18х40")
    category = Column(String, nullable=False)  # Техника, Ангары, Зерновые комплексы, Запчасти
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)  # Цена в тенге
    location = Column(String, default="Костанай")  # Регион/Город
    is_active = Column(Boolean, default=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связи
    owner = relationship("User", back_populates="ads")

class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_details = Column(String, nullable=False)  # Реквизиты, БИН или описание для администратора
    doc_url = Column(String, nullable=True)  # Ссылка на документ/удостоверение/талон КХ
    status = Column(String, default="pending")  # pending (на проверке), approved (галочка выдана), rejected (отказано)
    rejection_reason = Column(String, nullable=True)  # Причина отказа (если статус rejected)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связи
    user = relationship("User", back_populates="verifications")
