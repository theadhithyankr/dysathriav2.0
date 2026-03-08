# Dysera

AI-powered dysarthria assessment and speech therapy platform.  
**Frontend:** React + Vite · **Backend:** FastAPI · **Database:** Supabase (PostgreSQL) · **AI:** Groq LLaMA 3.3

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| Python | 3.12 |
| Git | any |

---

## 1. Clone the repository

```bash
git clone https://github.com/theadhithyankr/dysathriav2.0.git
cd dysathriav2.0
```

---

## 2. Backend setup

### 2a. Create a virtual environment

```bash
cd backend
python -m venv venv
```

Activate it:

- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

### 2b. Install dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ `torch` and `librosa` are large packages — this may take a few minutes.

### 2c. Create the environment file

```bash
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
GROQ_API_KEY=your_groq_api_key        # https://console.groq.com
DATABASE_URL=postgresql://...          # Supabase connection string
SECRET_KEY=any-long-random-string
```

### 2d. Train / restore the ML model

The model binaries are not in git. You have two options:

**Option A — Use your existing local model files:**  
Copy `dysarthria_clf.pkl`, `dysarthria_head.npz`, and `label_encoder.pkl` back into `backend/ml_models/`.

**Option B — Retrain from the TORGO dataset:**  
```bash
# From inside backend/ with venv active
python prepare_data.py   # extracts features from backend/data/torgo/
python train_model.py    # trains and saves model to backend/ml_models/
```

### 2e. Start the backend

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at **http://localhost:8000**  
API docs at **http://localhost:8000/docs**

---

## 3. Frontend setup

Open a **new terminal** in the project root (not inside `backend/`):

### 3a. Install dependencies

```bash
npm install
```

### 3b. Configure the API URL

For **local development**, no extra config is needed — Vite proxies `/api/*` to `localhost:8000` automatically.

For **production** (pointing to a deployed backend), create a `.env.local` file in the project root:

```env
VITE_API_URL=https://your-backend.onrender.com
```

### 3c. Start the frontend

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 4. Open the app

1. Go to **http://localhost:5173**
2. Click **Get Started** → Register a new account
3. Record a speech sample on **Record & Detect**
4. View results on your **Dashboard** and **My Reports**
5. Open **Vibra** for AI-guided exercises

---

## Project structure

```
dysathriav2.0/
├── src/                  # React frontend
│   ├── pages/            # All page components
│   ├── components/       # Layout + UI components
│   └── lib/              # auth.js, UserContext.jsx
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── routers/          # auth, audio, sessions, ai_coach, exercise_plans
│   ├── models/           # SQLAlchemy models + database setup
│   ├── services/         # ML classifier + feature extractor
│   ├── ml_models/        # Trained model files (not in git)
│   └── requirements.txt
├── public/
│   └── favicon.svg       # Dysera waveform logo
├── vercel.json           # Vercel SPA routing config
├── netlify.toml          # Netlify build + routing config
└── index.html
```

---

## Deployment

See the backend `Procfile` and `runtime.txt` for Render/Railway deployment.  
Set `VITE_API_URL` in Vercel/Netlify environment variables pointing to your deployed backend.
