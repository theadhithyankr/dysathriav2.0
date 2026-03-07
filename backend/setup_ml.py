"""
Download the TORGO dataset from Kaggle, then run feature extraction and model training.
Run this once: python setup_ml.py
"""

import os
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent if "__file__" in dir() else Path.cwd()
DATA_DIR = ROOT / "data" / "torgo"
MODELS_DIR = ROOT / "ml_models"
FEATURES_CSV = ROOT / "data" / "torgo_features.csv"

def step(msg: str):
    print(f"\n{'='*60}\n  {msg}\n{'='*60}")

def run(cmd: list[str]):
    result = subprocess.run(cmd, check=True, shell=(os.name == "nt"))
    return result

# ── 1. Download dataset ───────────────────────────────────────────────────────
step("Step 1/3 — Downloading TORGO dataset from Kaggle (~1.75 GB)")
DATA_DIR.parent.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

if DATA_DIR.exists() and any(DATA_DIR.iterdir()):
    print("  Dataset already present, skipping download.")
else:
    run([
        "kaggle",
        "datasets", "download",
        "-d", "pranaykoppula/torgo-audio",
        "--unzip",
        "-p", str(DATA_DIR),
    ])
    print("  Download complete.")

# ── 2. Feature extraction ─────────────────────────────────────────────────────
step("Step 2/3 — Extracting audio features (MFCC + pitch + spectral)")
if FEATURES_CSV.exists():
    print("  Features CSV already exists, skipping extraction.")
else:
    run([sys.executable, str(ROOT / "prepare_data.py")])

# ── 3. Train model ────────────────────────────────────────────────────────────
step("Step 3/3 — Training SVM classifier")
model_path = MODELS_DIR / "dysarthria_clf.pkl"
if model_path.exists():
    print("  Model already trained, skipping.")
else:
    run([sys.executable, str(ROOT / "train_model.py")])

step("All done! Backend is ready. Start the API with:  uvicorn main:app --reload")
