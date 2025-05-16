from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.combo import CombinedDataset
from app.services import huggingface
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from app.core.security import get_current_user, get_db
# from app.db import SessionLocal
from app.models.follow import FollowedDataset
from app.models.user import User

router = APIRouter()

class CombineRequest(BaseModel):
    name: str
    datasets: List[str]

@router.get("/public")
async def get_public_datasets(limit: int = 50):
    datasets = await huggingface.fetch_all_datasets(limit)
    return {"count": len(datasets), "datasets": datasets}

@router.get("/info/{dataset_name:path}")
async def get_dataset_info(dataset_name: str):
    info = await huggingface.fetch_dataset_info(dataset_name)
    return info

@router.post("/follow")
def follow_dataset(dataset_name: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(FollowedDataset).filter_by(user_id=current_user.id, dataset_name=dataset_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Dataset already followed")
    
    follow = FollowedDataset(user_id=current_user.id, dataset_name=dataset_name)
    db.add(follow)
    db.commit()
    return {"message": f"Dataset '{dataset_name}' followed."}

@router.get("/followed")
def get_followed_datasets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    follows = db.query(FollowedDataset).filter_by(user_id=current_user.id).all()
    return {"followed": [f.dataset_name for f in follows]}

@router.post("/combine")
def create_combined_dataset(payload: CombineRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    combo = CombinedDataset(
        user_id=current_user.id,
        name=payload.name,
        datasets=",".join(payload.datasets)
    )
    db.add(combo)
    db.commit()
    return {"message": f"Combined dataset '{payload.name}' created."}

def categorize_naive_impact(total_downloads: int) -> str:
    if total_downloads < 50000:
        return "low"
    elif total_downloads < 500000:
        return "medium"
    else:
        return "high"

@router.get("/impact/naive")
async def assess_naive_impact(datasets: str):
    dataset_list = datasets.split(",")
    total_downloads = 0

    for d in dataset_list:
        size = await huggingface.estimate_dataset_size(d.strip())
        total_downloads += size

    tier = categorize_naive_impact(total_downloads)

    return {
        "datasets": dataset_list,
        "estimated_total_downloads": total_downloads,
        "impact_level": tier,
        "thresholds": {
            "low": "< 50,000 downloads",
            "medium": "50,000 - 500,000 downloads",
            "high": "> 500,000 downloads"
        }
    }

@router.get("/impact/advanced")
async def assess_advanced_impact(combo_name: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    combo = db.query(CombinedDataset).filter_by(user_id=current_user.id, name=combo_name).first()
    if not combo:
        raise HTTPException(status_code=404, detail="Combination not found")

    dataset_names = combo.datasets.split(",")
    tag_lists = []

    for name in dataset_names:
        info = await huggingface.fetch_dataset_info(name.strip())
        tag_lists.append(info.get("tags", []))

    from app.services.impact import cluster_tags
    clusters = cluster_tags(tag_lists)

    impact = "high" if clusters > 1 else "medium"
    return {
        "combo": combo_name,
        "datasets": dataset_names,
        "distinct_clusters": clusters,
        "impact_level": impact
    }

@router.get("/history")
async def get_dataset_history(
    dataset_name: str,
    current_user: User = Depends(get_current_user)
):
    info = await huggingface.fetch_dataset_info(dataset_name)
    changelog = info.get("cardData", {}).get("changelog", "No changelog available.")
    return {
        "dataset": dataset_name,
        "history": changelog
    }

@router.get("/combos")
def get_user_combos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    combos = db.query(CombinedDataset).filter_by(user_id=current_user.id).all()
    combo_names = [combo.name for combo in combos]
    return {"combos": combo_names}