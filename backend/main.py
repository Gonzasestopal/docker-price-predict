from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Price Predictor API", version="1.0.0")

# Allow cross-origin requests (use restrictive origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
