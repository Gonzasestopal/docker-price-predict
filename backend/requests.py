from pydantic import BaseModel


class PriceRequest(BaseModel):
    bedrooms: int
    bathrooms: int
    size: int
    subwayDistance: int
    floor: int
    buildingAge: int
    noFee: bool
    hasRoofdeck: bool
    hasWasherDryer: bool
    hasDoorman: bool
    hasElevator: bool
    hasDishwasher: bool
    hasPatio: bool
    hasGym: bool
