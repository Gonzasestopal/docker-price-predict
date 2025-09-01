from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Price Predictor API", version="1.0.0")

# Allow cross-origin requests (use restrictive origins in production)
ALLOWED_ORIGINS = [
    "https://docker-price-predict.lovable.app",  # production
    "http://localhost:5173",                     # local Vite dev
    "http://127.0.0.1:5173",                     # sometimes needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # be explicit
    allow_headers=["Content-Type", "Authorization"],  # add any custom headers you use
)


@app.get("/predict")
def predict():
    """
    Returns a sample price prediction in the requested format.
    """
    return {"price": 4002.23}


@app.get("/")
def root():
    return {
        "name": "Price Predictor API",
        "endpoints": ["/predict"],
        "message": "Use GET /predict to retrieve a price in the format {'price': 4002.23}",
    }
