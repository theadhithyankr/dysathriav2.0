"""Classifier service — loads the trained model once and exposes predict()."""

import joblib
import numpy as np
from pathlib import Path
from dataclasses import dataclass

_MODEL_DIR  = Path(__file__).parent.parent / "ml_models"
_MODEL_PATH = _MODEL_DIR / "dysarthria_clf.pkl"
_ENC_PATH   = _MODEL_DIR / "label_encoder.pkl"

_pipeline = None
_encoder  = None

# Acoustic feature names for the 7 extras (indices 80-86)
_EXTRA_NAMES = [
    "f0_mean", "f0_std", "unvoiced_ratio",
    "spectral_centroid", "spectral_rolloff",
    "zero_crossing_rate", "pause_ratio",
]


@dataclass
class PredictionResult:
    severity: str            # Healthy / Mild / Moderate / Severe
    confidence: float        # 0..1 — probability of predicted class
    probabilities: dict      # {class: probability}
    score: float             # overall intelligibility score (0-100, higher = better)
    acoustic_features: dict  # subset of named features for the UI


def _load_model():
    global _pipeline, _encoder
    if _pipeline is None:
        if not _MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Trained model not found at {_MODEL_PATH}. "
                "Run `python setup_ml.py` first."
            )
        _pipeline = joblib.load(_MODEL_PATH)
        _encoder  = joblib.load(_ENC_PATH)


def predict(features: np.ndarray) -> PredictionResult:
    """
    features: (87,) float32 array from feature_extractor.extract_features_from_bytes()
    Returns a PredictionResult with severity label, confidence, and UI-ready scores.
    """
    _load_model()
    X = features.reshape(1, -1)

    class_idx  = int(_pipeline.predict(X)[0])
    proba      = _pipeline.predict_proba(X)[0]
    severity   = _encoder.inverse_transform([class_idx])[0]
    classes    = list(_encoder.classes_)
    probs_dict = {cls: round(float(p), 4) for cls, p in zip(classes, proba)}

    # Map severity to an intuitive 0-100 "intelligibility score"
    severity_to_score = {"Healthy": 95, "Mild": 72, "Moderate": 48, "Severe": 22}
    base_score = severity_to_score.get(severity, 50)
    confidence = float(proba[class_idx])
    # Blend base score with confidence so high-confidence predictions push further
    score = round(base_score + (confidence - 0.5) * 10, 1)
    score = float(np.clip(score, 5, 100))

    # Pull out named acoustic features for the UI (indices 80-86)
    acoustic = {name: round(float(features[80 + i]), 4)
                for i, name in enumerate(_EXTRA_NAMES)}

    return PredictionResult(
        severity=severity,
        confidence=round(confidence, 4),
        probabilities=probs_dict,
        score=score,
        acoustic_features=acoustic,
    )
