import math

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

CSV_URL = "https://raw.githubusercontent.com/sonnynomnom/Codecademy-Machine-Learning-Fundamentals/master/StreetEasy/manhattan.csv"


class PriceModel:
    def __init__(self):
        self.model = None
        self.features = [
            'bedrooms', 'bathrooms', 'size_sqft', 'min_to_subway', 'floor',
            'building_age_yrs', 'no_fee', 'has_roofdeck', 'has_washer_dryer',
            'has_doorman', 'has_elevator', 'has_dishwasher', 'has_patio', 'has_gym'
        ]

    def load_and_train(self):
        df = pd.read_csv(CSV_URL)
        X = df[self.features]
        y = df[['rent']]

        x_tr, x_te, y_tr, y_te = train_test_split(
            X, y, train_size=0.8, test_size=0.2, random_state=6
        )

        self.model = LinearRegression().fit(x_tr, y_tr)

        # predictions for test set
        y_pred = self.model.predict(x_te)[:, 0]
        y_true = y_te['rent'].values

        r2 = float(r2_score(y_true, y_pred))
        mae = float(mean_absolute_error(y_true, y_pred))
        rmse = float(math.sqrt(mean_squared_error(y_true, y_pred)))

        coeffs = dict(zip(self.features, self.model.coef_[0].tolist()))
        intercept = float(self.model.intercept_[0])

        self.metrics = {
            'target': 'rent',
            "r2": r2,
            "mae": mae,
            "rmse": rmse,
            "n_train": int(len(x_tr)),
            "n_test": int(len(x_te)),
            "intercept": intercept,
            "coefficients": coeffs,
        }

    def predict(self, payload) -> float:
        row = [[
            payload.bedrooms, payload.bathrooms, payload.size, payload.subwayDistance,
            payload.floor, payload.buildingAge, int(payload.noFee), int(payload.hasRoofdeck),
            int(payload.hasWasherDryer), int(payload.hasDoorman), int(payload.hasElevator),
            int(payload.hasDishwasher), int(payload.hasPatio), int(payload.hasGym),
        ]]
        return float(self.model.predict(row)[0, 0])


price_model = PriceModel()
