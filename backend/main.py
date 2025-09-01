from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.predict import price_model
from backend.requests import PriceRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- startup ----
    price_model.load_and_train()
    print("✅ Model trained once at startup")

    yield  # app runs here

    # ---- shutdown ----
    # close DB, redis, etc. if you add them later
    print("🛑 App shutting down...")

app = FastAPI(title="Price Predictor API", version="1.0.0", lifespan=lifespan)

# Allow cross-origin requests (use restrictive origins in production)
ALLOWED_ORIGINS = [
    "https://docker-price-predict.lovable.app",  # production
    "https://lovable.dev",                       # Lovable domain
    "http://localhost:5173",                     # local Vite dev
    "http://127.0.0.1:5173",                     # sometimes needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.sandbox\.lovable\.dev",  # any sandbox subdomain
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # be explicit
    allow_headers=["Content-Type", "Authorization"],  # add any custom headers you use
)


@app.post("/predict")
def predict(price: PriceRequest):
    """
    Returns a sample price prediction in the requested format.
    """
    value = price_model.predict(price)
    return {"price": f"{value:.2f}"}


@app.get("/metrics")
def metrics_all():
    """
    Convenience endpoint to see R², MAE, RMSE, and split sizes.
    """
    if not price_model.metrics:
        return {"error": "Model not trained"}
    return price_model.metrics


@app.get("/")
def root():
    return {
        "name": "Price Predictor API",
        "endpoints": ["/predict", '/metrics'],
        "message": "Use GET /predict to retrieve a price in the format {'price': 4002.23}",
    }
