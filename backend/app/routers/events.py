from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Event, User
from app.schemas import EventCreate, EventOut
from app.security import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=list[EventOut])
def list_events(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return list(db.scalars(select(Event).order_by(Event.event_date)).all())


@router.post("", response_model=EventOut, status_code=201)
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = Event(**data.model_dump(), created_by=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.get(Event, event_id)
    if not item:
        raise HTTPException(status_code=404, detail="Event not found")
    if item.created_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(item)
    db.commit()
