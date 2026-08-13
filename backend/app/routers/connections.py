from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Connection, User
from app.schemas import ConnectionCreate, ConnectionOut
from app.security import get_current_user

router = APIRouter(prefix="/connections", tags=["Connections"])


@router.get("", response_model=list[ConnectionOut])
def list_connections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Connection).where(
        or_(
            Connection.requester_id == current_user.id,
            Connection.receiver_id == current_user.id,
        )
    ).order_by(Connection.created_at.desc())
    return list(db.scalars(stmt).all())


@router.post("", response_model=ConnectionOut, status_code=201)
def create_connection(
    data: ConnectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.receiver_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot connect with yourself")

    receiver = db.get(User, data.receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.scalar(
        select(Connection).where(
            Connection.requester_id == current_user.id,
            Connection.receiver_id == data.receiver_id,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Connection already exists")

    item = Connection(
        requester_id=current_user.id,
        receiver_id=data.receiver_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
