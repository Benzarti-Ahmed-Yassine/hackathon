from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import time
import numpy as np

app = FastAPI(title="SAEG AI LSTM Service")

class SensorData(BaseModel):
    history: list[float]  # Last 10-20 readings
    sensor_type: str

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "model": "LSTM-Pollution-Predictor-v1"}

@app.post("/predict")
def predict_pollution(data: SensorData):
    """
    Simulates an LSTM prediction for the next sensor reading.
    In a real scenario, this would load a .pth or .h5 model.
    """
    if not data.history:
        raise HTTPException(status_code=400, detail="History is empty")
    
    # Simple simulation logic (Mocking LSTM behavior)
    # Average + trend + random noise
    recent_avg = sum(data.history[-5:]) / min(len(data.history), 5)
    trend = (data.history[-1] - data.history[0]) / len(data.history)
    
    # Mocking a 'spike' detection if history shows upward trend
    prediction = recent_avg + (trend * 2) + random.uniform(-0.1, 0.1)
    
    # Anomaly detection logic
    is_anomaly = prediction > (recent_avg * 1.5)
    
    return {
        "sensor_type": data.sensor_type,
        "current_val": data.history[-1],
        "predicted_val": round(prediction, 4),
        "is_anomaly": is_anomaly,
        "recommendation": "TUTELLE_ECOLOGIQUE" if is_anomaly else "CONTINUE_MONITORING",
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
