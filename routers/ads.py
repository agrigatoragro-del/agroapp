from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel

router = APIRouter(prefix="/ads", tags=["Advertisements"])

class AdCreate(BaseModel):
    title: str
    category: str
    description: str | None = None
    price: float
    region: str
    photo_url: str | None = None
    owner_id: int

@router.post("/")
def create_advertisement(ad: AdCreate, db: Session = Depends(get_db)):
    """Публикация объявления"""
    user = db.query(models.User).filter(models.User.id == ad.owner_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    new_ad = models.Advertisement(
        title=ad.title,
        category=ad.category,
        description=ad.description,
        price=ad.price,
        region=ad.region,
        photo_url=ad.photo_url,
        owner_id=ad.owner_id
    )
    
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    
    return {"status": "success", "message": "Объявление успешно опубликовано!", "ad_id": new_ad.id}

@router.get("/")
def get_all_advertisements(category: str | None = None, region: str | None = None, db: Session = Depends(get_db)):
    """Получение списка объявлений с фильтрами"""
    query = db.query(models.Advertisement).filter(models.Advertisement.status == "active")
    
    if category:
        query = query.filter(models.Advertisement.category == category)
    if region:
        query = query.filter(models.Advertisement.region == region)
        
    return query.all()
