from fastapi import FastAPI
from pydantic import BaseModel, Field, confloat
from typing import Optional
import pymongo

app = FastAPI()
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["user_database"]
mycol = mydb["user"]

class GeolocationCoordinates(BaseModel):
    latitude: confloat(ge=-90, le=90) = Field(..., description="Latitude in decimal degrees, between -90 and 90") # type: ignore
    longitude: confloat(ge=-180, le=180) = Field(..., description="Longitude in decimal degrees, between -180 and 180") # type: ignore
    altitude: float = Field(None, description="Optional altitude in meters above sea level")

class User(BaseModel):
    userId: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    interests: list=None
    visibility: bool=False
    lta: Optional[str]=None
    location: GeolocationCoordinates

@app.get("/user/get_users")
async def root():
    filter_query = {"visibility": True}
    results = mycol.find(filter_query)
    objects_list = list(results)
    return objects_list

@app.patch("/user/update_user/{user_id}", response_model=User)
async def update_user(user_id: str, user: User = None):
    myquery = { "userId": user_id }
    newvalues={"$set" :{"location": user.location, "visibility": user.visibility, "lta": user.lta}}
    updated=mycol.update_one(myquery, newvalues)
    return updated


# api endpoints:
# get visible users
# update_user
# 

# register
# set your interests & visibility & location

# demo:
# sign in
# set your lta & visibility on & gets ur location
    # updates user fields
# goes to map screen
# gets all users that have visibility on, puts them on map
# 