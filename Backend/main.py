from fastapi import FastAPI
from pydantic import BaseModel, Field, confloat
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from bson.objectid import ObjectId
import uvicorn
import pymongo

app = FastAPI()
myclient = pymongo.MongoClient("mongodb+srv://rachana:dummypassword@user.rehyj.mongodb.net/?retryWrites=true&w=majority&appName=user")
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
    latitude: float
    longitude: float
    def to_dict(self):
        return {"latitude": self.latitude, "longitude": self.longitude}

class User(BaseModel):
    userId: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    interests: Optional[list[str]]=None
    visibility: bool=False
    lta: Optional[str]=None
    location: GeolocationCoordinates

@app.get("/user/get_users/{user_id}")
def root(user_id: str):
    filter_query = {"visibility": True}
    results = mycol.find(filter_query)
    results_list = []
    for doc in results:
        if doc["name"]=="ada":
            print("smth")
            print(doc["_id"])
            continue
        if doc["_id"]!=user_id:
            results_list.append({'name':doc['name'],'interests':doc['interests'], 'location': doc['location'], 'lta':doc['lta']})
    return results_list

@app.patch("/user/update_user/{user_id}")
def update_user(user_id: str, user: User = None):
    print(user_id)
    myquery = { "_id": ObjectId(user_id)}
    print(mycol.find_one(myquery))
    newvalues={"$set" :{"location": user.location.to_dict(), "visibility": user.visibility, "lta": user.lta}}
    updated=mycol.update_one(myquery, newvalues)
    print(updated)
    print(mycol.find_one(myquery))
    return user_id


@app.get("/user/interest/{interest}")
def get_search(interest: str, uid: str):
    query = {"interests": interest}
    result_list = list(mycol.find(query))
    res_list=[]
    for doc in result_list:
        if doc["_id"]!=uid:
            res_list.append({'name':doc['name'],'interests':doc['interests'], 'location': doc['location'], 'lta':doc['lta']})
    return res_list

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