import httpx
import os

app = FastAPI(title="SAEG AI LSTM & Groq Service")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")

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
    
class ActionPlanRequest(BaseModel):
    ipt_score: float
    classification: str
    anomaly_risk: bool
    sensor_type: str
    recent_trend: list[float]

@app.post("/action-plan")
async def generate_action_plan(data: ActionPlanRequest):
    """
    Connects to Groq (Cloud LLM) for high-precision action plans.
    Falls back to local Ollama if Groq is not configured.
    """
    prompt = f"""
    Agis en tant qu'expert en ingénierie environnementale pour l'industrie textile à Monastir, Tunisie.
    
    Données d'audit :
    - Score IPT : {data.ipt_score}
    - Classification : {data.classification}
    - Risque d'anomalie LSTM : {"OUI" if data.anomaly_risk else "NON"}
    - Capteur concerné : {data.sensor_type}
    - Tendance : {data.recent_trend}
    
    Problématique : Pollution nappe phréatique et mer.
    
    Tâche : Rédige un plan d'action court (3 points) extrêmement précis et technique en Français.
    """

    # If Groq Key is available, use it (10x faster)
    if GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": "Tu es un expert en dépollution industrielle textile à Monastir."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.5
                    }
                )
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "action_plan": result['choices'][0]['message']['content'],
                        "source": "Groq Cloud (Llama 3.3 70B)",
                        "timestamp": time.time()
                    }
        except Exception as e:
            print(f"Groq failed, falling back to Ollama: {str(e)}")

    # Fallback to local Ollama
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={"model": "llama3", "prompt": prompt, "stream": False}
            )
            if response.status_code == 200:
                result = response.json()
                return {
                    "action_plan": result.get("response", "Aucun plan généré."),
                    "source": "Local Ollama (Fallback)",
                    "timestamp": time.time()
                }
    except Exception as e:
        return {"error": "All AI providers failed", "details": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
