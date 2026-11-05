from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/verification", tags=["Verification System"])

class VerificationSubmit(BaseModel):
    user_id: int
    company_details: str  # БИН, название, описание для проверки
    doc_url: Optional[str] = None  # Ссылка на сканы документов / свидетельство КХ

class AdminReview(BaseModel):
    status: str  # approved или rejected
    rejection_reason: Optional[str] = None

# 1. Подать заявку на получение «синей галочки»
@router.post("/", summary="Подать заявку на Verified Vendor")
def submit_verification(data: VerificationSubmit, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Проверяем, нет ли уже активной заявки на рассмотрении
    existing_req = db.query(models.VerificationRequest).filter(
        models.VerificationRequest.user_id == data.user_id,
        models.VerificationRequest.status == "pending"
    ).first()
    
    if existing_req:
        raise HTTPException(status_code=400, detail="У вас уже есть активная заявка на рассмотрении")

    new_request = models.VerificationRequest(
        user_id=data.user_id,
        company_details=data.company_details,
        doc_url=data.doc_url,
        status="pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return {"message": "Заявка успешно отправлена на модерацию", "request_id": new_request.id}

# 2. Рассмотрение заявки администратором (выдача синей галочки)
@router.post("/admin/review/{request_id}", summary="Админ: одобрить или отклонить заявку")
def review_verification(request_id: int, review: AdminReview, db: Session = Depends(get_db)):
    req = db.query(models.VerificationRequest).filter(models.VerificationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    
    if review.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Неверный статус. Используйте 'approved' или 'rejected'")

    req.status = review.status
    if review.status == "approved":
        req.rejection_reason = None
        # Выдаем пользователю заветную синюю галочку!
        user = db.query(models.User).filter(models.User.id == req.user_id).first()
        if user:
            user.is_verified = True
    else:
        req.rejection_reason = review.rejection_reason
        user = db.query(models.User).filter(models.User.id == req.user_id).first()
        if user:
            user.is_verified = False

    db.commit()
    return {"message": f"Заявка успешно обработана со статусом: {review.status}"}
