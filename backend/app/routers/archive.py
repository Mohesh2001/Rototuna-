from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import ArchiveItem, User
from app.schemas import ArchiveCreate, ArchiveOut
from app.security import get_current_user

router = APIRouter(prefix="/archive", tags=["Digital Archive"])


@router.get("", response_model=list[ArchiveOut])
def list_archive(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return list(db.scalars(select(ArchiveItem).order_by(ArchiveItem.year.desc(), ArchiveItem.title)).all())


@router.post("", response_model=ArchiveOut, status_code=201)
def create_archive(
    data: ArchiveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = ArchiveItem(**data.model_dump(), created_by=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_archive(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.get(ArchiveItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Archive item not found")
    if item.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(item)
    db.commit()
