"""
Train the Dysarthria SVM classifier.
Reads:   data/torgo_features.csv
Writes:  ml_models/dysarthria_clf.pkl   (sklearn Pipeline + LabelEncoder)
         ml_models/metrics.txt          (CV + held-out report)
"""

import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix

ROOT      = Path(__file__).parent if "__file__" in dir() else Path.cwd()
DATA_CSV  = ROOT / "data" / "torgo_features.csv"
MODEL_DIR = ROOT / "ml_models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUT_MODEL   = MODEL_DIR / "dysarthria_clf.pkl"
OUT_ENCODER = MODEL_DIR / "label_encoder.pkl"
OUT_METRICS = MODEL_DIR / "metrics.txt"


def load_data(csv_path: Path):
    df = pd.read_csv(csv_path)
    feature_cols = [c for c in df.columns if c.startswith("f")]
    X = df[feature_cols].values.astype(np.float32)
    y = df["severity"].values
    groups = df["speaker"].values
    file_names = df["file"].values
    return X, y, groups, file_names


def build_pipeline() -> Pipeline:
    return Pipeline([
        ("scaler", StandardScaler()),
        ("svm", SVC(
            kernel="rbf",
            C=10,
            gamma="scale",
            class_weight="balanced",
            probability=True,
            random_state=42,
        )),
    ])


def train(csv_path: Path = DATA_CSV):
    print(f"Loading features from {csv_path}")
    X, y, groups, _ = load_data(csv_path)
    print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")
    print(f"Class distribution:\n{pd.Series(y).value_counts().to_string()}\n")

    # Encode labels
    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    print(f"Classes: {list(le.classes_)}\n")

    # ── Speaker-independent cross-validation ─────────────────────────────
    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    pipeline = build_pipeline()

    print("Running 5-fold speaker-independent cross-validation …")
    y_pred_cv = cross_val_predict(
        pipeline, X, y_enc, groups=groups, cv=cv,
        method="predict",
    )
    cv_report = classification_report(y_enc, y_pred_cv, target_names=le.classes_)
    cm        = confusion_matrix(y_enc, y_pred_cv)
    print("Cross-validation results:")
    print(cv_report)
    print("Confusion matrix:\n", cm)

    # ── Final model — train on full dataset ──────────────────────────────
    print("Training final model on full dataset …")
    final_pipeline = build_pipeline()
    final_pipeline.fit(X, y_enc)

    # Persist
    joblib.dump(final_pipeline, OUT_MODEL)
    joblib.dump(le, OUT_ENCODER)
    print(f"Model saved   -> {OUT_MODEL}")
    print(f"Encoder saved -> {OUT_ENCODER}")

    metrics_text = (
        f"5-fold speaker-independent CV report\n"
        f"{'='*50}\n"
        f"{cv_report}\n"
        f"Confusion matrix:\n{cm}\n"
    )
    OUT_METRICS.write_text(metrics_text)
    print(f"Metrics saved -> {OUT_METRICS}")

    return final_pipeline, le


if __name__ == "__main__":
    train()
