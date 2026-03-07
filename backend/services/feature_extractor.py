"""Feature extraction service — wraps the librosa pipeline for inference."""

import warnings
import numpy as np
import io
import librosa

warnings.filterwarnings("ignore")

TARGET_SR = 16000


def extract_features_from_bytes(wav_bytes: bytes) -> np.ndarray:
    """
    Accept raw audio bytes (wav/mp3/ogg) and return an 87-dim feature vector.
    Raises ValueError if the clip is too short.
    """
    y, sr = librosa.load(io.BytesIO(wav_bytes), sr=TARGET_SR, mono=True)
    if len(y) < TARGET_SR * 0.3:
        raise ValueError("Audio clip too short (minimum 300 ms required)")
    return _compute_features(y, sr)


def _compute_features(y: np.ndarray, sr: int) -> np.ndarray:
    # ── MFCCs ──────────────────────────────────────────────────────────────
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfcc_mean = np.mean(mfcc, axis=1).astype(np.float32)
    mfcc_std  = np.std(mfcc,  axis=1).astype(np.float32)

    # ── Pitch (F0) ─────────────────────────────────────────────────────────
    try:
        f0, voiced_flag, _ = librosa.pyin(y, fmin=50, fmax=400, sr=sr)
        f0_voiced = f0[voiced_flag] if voiced_flag is not None and voiced_flag.any() else np.array([0.0])
        f0_mean   = float(np.mean(f0_voiced))
        f0_std    = float(np.std(f0_voiced))
        unvoiced  = float(1 - voiced_flag.mean()) if voiced_flag is not None else 1.0
    except Exception:
        f0_mean, f0_std, unvoiced = 0.0, 0.0, 1.0

    # ── Spectral ───────────────────────────────────────────────────────────
    spec_centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    spec_rolloff  = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))
    zcr           = float(np.mean(librosa.feature.zero_crossing_rate(y)))

    # ── Pause ratio ────────────────────────────────────────────────────────
    intervals     = librosa.effects.split(y, top_db=25)
    speech_frames = sum(int(e) - int(s) for s, e in intervals) if len(intervals) else 0
    pause_ratio   = float(1.0 - (speech_frames / max(len(y), 1)))

    extra = np.array([f0_mean, f0_std, unvoiced,
                      spec_centroid, spec_rolloff, zcr, pause_ratio],
                     dtype=np.float32)

    return np.concatenate([mfcc_mean, mfcc_std, extra])  # (87,)
