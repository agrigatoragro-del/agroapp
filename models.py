from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    bin_iin = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Статусы и монетизация
    is_verified = Column(Boolean, default=False)  # Заветная «синяя галочка» Verified Vendor
    partner_status = Column(String, default="standard")  # standard, app_partner, friend_of_company
    ad_credits = Column(Integer, default=0)        # Баланс рекламных кредитов для продвижения
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связи
    ads = relationship("Ad", back_populates="owner", cascade="all, delete-orphan")
    verification_requests = relationship("VerificationRequest", back_populates="user", cascade="all, delete-orphan")


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)     # Ангары, Зерновые комплексы, Сельхозтехника и т.д.
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    location = Column(String, default="Костанай")  # Регион / город для удобной логистики и фильтрации
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="ads")


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_details = Column(String, nullable=False)  # БИН, наименование, данные КХ
    doc_url = Column(String, nullable=True)           # Ссылка на документы / свидетельство
    status = Column(String, default="pending")        # pending (на рассмотрении), approved (одобрено), rejected (отклонено)
    rejection_reason = Column(String, nullable=True)  # Причина отказа (если отклонено)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="verification_requests")
