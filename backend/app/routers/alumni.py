from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Alumni, User
from app.schemas import AlumniCreate, AlumniOut
from app.security import get_current_user

router = APIRouter(prefix="/alumni", tags=["Alumni"])


@router.get("", response_model=list[AlumniOut])
def list_alumni(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    stmt = select(Alumni).order_by(Alumni.name)
    if search:
        term = f"%{search}%"
        stmt = stmt.where(
            or_(
                Alumni.name.ilike(term),
                Alumni.company.ilike(term),
                Alumni.course.ilike(term),
                Alumni.location.ilike(term),
            )
        )
    return list(db.scalars(stmt).all())


@router.post("", response_model=AlumniOut, status_code=201)
def create_alumni(
    data: AlumniCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = Alumni(**data.model_dump(), created_by=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{alumni_id}", status_code=204)
def delete_alumni(
    alumni_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.get(Alumni, alumni_id)
    if not item:
        return
    if item.created_by != current_user.id and not current_user.is_admin:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(item)
    db.commit()
