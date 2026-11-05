from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Ad, User
import shutil
import os
import json

router = APIRouter(prefix="/api/ads", tags=["Ads"])
UPLOAD_DIR = "static/uploads/ads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
def get_ads(admin_view: bool = False, db: Session = Depends(get_db)):
    if admin_view:
        return db.query(Ad).order_by(Ad.id.desc()).all()
    # Обычные пользователи видят только одобренные модератором объявления
    return db.query(Ad).filter(Ad.is_approved == True).order_by(Ad.id.desc()).all()

@router.post("/")
async def create_ad(
    title: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    phone: str = Form(...),
    user_id: int = Form(...),
    images: list[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_urls = []
    if images:
        for img in images[:10]: # Жесткое ограничение до 10 фотографий
            file_path = os.path.join(UPLOAD_DIR, f"ad_{user_id}_{img.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(img.file, buffer)
            image_urls.append(f"/{file_path}")

    new_ad = Ad(
        title=title,
        category=category,
        location=location,
        description=description,
        price=price,
        phone=phone,
        user_id=user_id,
        images_json=json.dumps(image_urls),
        is_approved=False # Отправляется на модерацию
    )
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    return {"message": "Объявление успешно отправлено на модерацию администратору", "ad": new_ad}

@router.post("/{ad_id}/approve")
def approve_ad(ad_id: int, db: Session = Depends(get_db)):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Объявление не найдено")
    ad.is_approved = True
    db.commit()
    return {"message": "Объявление успешно одобрено и опубликовано"}

@router.delete("/{ad_id}")
def delete_ad(ad_id: int, db: Session = Depends(get_db)):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Объявление не найдено")
    db.delete(ad)
    db.commit()
    return {"message": "Объявление удалено"}
