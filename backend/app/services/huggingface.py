# app/services/huggingface.py

import httpx
from app.core.config import HUGGINGFACE_TOKEN

BASE_URL = "https://huggingface.co/api"

async def fetch_all_datasets(limit: int = 50):
    url = f"{BASE_URL}/datasets?limit={limit}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            return [dataset["id"] for dataset in data]
    except httpx.RequestError as e:
        return [f"Request error: {str(e)}"]
    except httpx.HTTPStatusError as e:
        return [f"HTTP error: {str(e)}"]

async def fetch_dataset_info(dataset_name: str):
    headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
    url = f"{BASE_URL}/datasets/{dataset_name}"
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url,headers=headers)
            response.raise_for_status()
            data = response.json()
            if response.status_code == 404:
                return {"error": f"No such dataset found: '{dataset_name}'"}

            return {
                "id": data.get("id"),
                "lastModified": data.get("lastModified"),
                "tags": data.get("tags", []),
                "downloads": data.get("downloads"),
                "likes": data.get("likes"),
                "cardData": data.get("cardData", {}),
                "private": data.get("private", False)
            }
    except httpx.RequestError as e:
        return {"error": f"Request error: {str(e)}"}
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return {"error": f"No such dataset found: '{dataset_name}'"}
        return {"error": f"HTTP error: {str(e)}"}
    
async def estimate_dataset_size(dataset_name: str) -> int:
    info = await fetch_dataset_info(dataset_name)
    downloads = info.get("downloads", 0)
    return downloads