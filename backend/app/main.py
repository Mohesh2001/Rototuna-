from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import Base, engine
from app.routers import alumni, archive, auth, connections, events

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rototuna Alumni Connect & Digital Archive API",
    version="1.0.0",
    description="FastAPI + PostgreSQL + JWT backend for the Rototuna Alumni Connect project.",
)

origins = [item.strip() for item in settings.cors_origins.split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(alumni.router, prefix="/api")
app.include_router(archive.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(connections.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Rototuna Alumni Connect API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
