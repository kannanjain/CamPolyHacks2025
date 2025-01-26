from fastapi import FastAPI
from pydantic import BaseModel, Field, confloat
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import pymongo

app = FastAPI()
myclient = pymongo.MongoClient("mongodb+srv://rachana:dummypassword@user.rehyj.mongodb.net/?retryWrites=true&w=majority&appName=user",server_api=pymongo.server_api.ServerApi(
 version="1"))
mydb = myclient["user_database"]
mycol = mydb["user"]

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def root():
    filter_query = {"visibility": True}
    results = mycol.find(filter_query)
    results_list = []
    for doc in results:
        results_list.append({'name':doc['name'],'interests':doc['interests'], 'location': doc['location']})
    return results_list
# @app.patch("/user/update_user/{user_id}", response_model=User)
# async def update_user(user_id: str, user: User = None):
#     myquery = { "userId": user_id }
#     newvalues={"$set" :{"location": user.location, "visibility": user.visibility, "lta": user.lta}}
#     updated=mycol.update_one(myquery, newvalues)
#     return updated

if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


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