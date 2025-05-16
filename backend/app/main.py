# # backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, datasets
# from app.models.user import User
# from app.models.follow import FollowedDataset
# from app.models.combo import CombinedDataset
from app.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(datasets.router, prefix="/datasets")

@app.get("/")
def root():
    return {"message": "HuggingFace Dataset Explorer Backend"}
