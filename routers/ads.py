from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Ad, User
from pydantic import BaseModel
import shutil
import os

router = APIRouter(prefix="/api/ads", tags=["Ads"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class AdResponse(BaseModel):
    id: int
    title: str
    category: str
    location: str
    description: str
    price: float
    phone: str
    user_id: int
    image_url: str = None

    class Config:
        from_attributes = True

@router.get("/")
def get_ads(db: Session = Depends(get_db)):
    ads = db.query(Ad).order_by(Ad.id.desc()).all()
    return ads

@router.post("/")
async def create_ad(
    title: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    phone: str = Form(...),
    user_id: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        file_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/{file_path}"

    new_ad = Ad(
        title=title,
        category=category,
        location=location,
        description=description,
        price=price,
        phone=phone,
        user_id=user_id,
        image_url=image_url
    )
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    return new_ad
