# Hugging Face Full Stack App

This project is a full stack app to explore HuggingFace datasets. It includes:
- Backend: FastAPI
- Frontend: Next.js + React + Redux
- Testing: Pytest (backend), Jest + RTL (frontend)

---

## Backend Setup (FastAPI)

### 1. Navigate to backend
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
# Create
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/macOS)
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the server
```bash
uvicorn app.main:app --reload
```

### 5. Run backend tests
```bash
# From inside backend/
PYTHONPATH=. pytest tests/
```

---

## Frontend Setup (Next.js + Redux)

### 1. Navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the frontend app
```bash
npx next dev
```

### 4. Run frontend tests
```bash
npm run test
```

> Note: Jest is configured with `ts-jest` and `@testing-library/react`.

---

## Ready to go!

- App URL: `http://localhost:3000`
- API URL: `http://localhost:8000`


