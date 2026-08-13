from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=150)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    is_admin: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class AlumniBase(BaseModel):
    name: str
    graduation_year: int | None = None
    course: str | None = None
    company: str | None = None
    job_title: str | None = None
    location: str | None = None
    bio: str | None = None
    linkedin_url: str | None = None


class AlumniCreate(AlumniBase):
    pass


class AlumniOut(AlumniBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_by: int
    created_at: datetime


class ArchiveBase(BaseModel):
    title: str
    description: str | None = None
    category: str = "General"
    year: int | None = None
    file_url: str | None = None
    image_url: str | None = None


class ArchiveCreate(ArchiveBase):
    pass


class ArchiveOut(ArchiveBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_by: int
    created_at: datetime


class EventBase(BaseModel):
    title: str
    description: str | None = None
    event_date: datetime
    location: str | None = None


class EventCreate(EventBase):
    pass


class EventOut(EventBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_by: int
    created_at: datetime


class ConnectionCreate(BaseModel):
    receiver_id: int


class ConnectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    requester_id: int
    receiver_id: int
    status: str
    created_at: datetime
