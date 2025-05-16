from sqlalchemy import Column, Integer, String, ForeignKey
from app.db import Base

class CombinedDataset(Base):
    __tablename__ = "combined_datasets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    datasets = Column(String)  # store as comma-separated names or use a relation later
