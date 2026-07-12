import numpy as np
from logger import logger

try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False


class EsgAnomalyDetector:
    """Statistical anomaly detection on numeric ESG features"""

    def __init__(self, contamination: float = 0.1):
        self.contamination = contamination
        self.is_fitted = False
        self.mean = None
        self.std = None
        logger.info("EsgAnomalyDetector initialized (mock mode)" if not TORCH_AVAILABLE else "EsgAnomalyDetector initialized")

    def fit(self, X: np.ndarray):
        """Fit on normal ESG feature data"""
        if not TORCH_AVAILABLE or not CV2_AVAILABLE:
            # Deterministic mock
            self.mean = np.mean(X, axis=0)
            self.std = np.std(X, axis=0) + 1e-6
            self.is_fitted = True
            return self
        
        # Real implementation would use torch
        self.mean = np.mean(X, axis=0)
        self.std = np.std(X, axis=0) + 1e-6
        self.is_fitted = True
        return self

    def detect(self, X: np.ndarray) -> np.ndarray:
        """Detect anomalies - returns boolean array"""
        if not self.is_fitted:
            self.fit(X)
        
        # Z-score based anomaly detection
        z_scores = np.abs((X - self.mean) / self.std)
        anomalies = np.any(z_scores > 3, axis=1)  # 3-sigma rule
        return anomalies

    def score_samples(self, X: np.ndarray) -> np.ndarray:
        """Return anomaly scores"""
        if not self.is_fitted:
            self.fit(X)
        z_scores = np.abs((X - self.mean) / self.std)
        return np.max(z_scores, axis=1)


def detect_esg_anomalies(data: dict) -> dict:
    """Convenience function for ESG anomaly detection"""
    detector = EsgAnomalyDetector()
    # Convert dict to feature array
    features = np.array([[v for v in data.values() if isinstance(v, (int, float))]])
    if features.size == 0:
        return {"anomalies": [], "scores": []}
    anomalies = detector.detect(features)
    scores = detector.score_samples(features)
    return {"anomalies": anomalies.tolist(), "scores": scores.tolist()}