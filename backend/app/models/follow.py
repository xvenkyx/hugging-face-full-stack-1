from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from app.db import Base

class FollowedDataset(Base):
    __tablename__ = "followed_datasets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    dataset_name = Column(String, index=True)

    __table_args__ = (UniqueConstraint('user_id', 'dataset_name', name='user_dataset_unique'),)
