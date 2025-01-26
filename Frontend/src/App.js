import pin from './pin.png';
import bluePin from './bluepin.png';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
console.log(ReactMapGL)
const uid="6795f5d467e06ca445743c32"
const token="pk.eyJ1Ijoic3VtZWRoYS1rdW4iLCJhIjoiY202Y3YzZDl5MG1qYjJsb29oZG05ZzNrdyJ9.znQxXNQe-ze2jFZbgdYcvw"

export default function App() {
  const [viewport, setViewport] = useState({
  latitude: 35.300475,
  longitude: -120.662046,
zoom: 15});
const [userLocation, setUserLocation] = useState(null);
const [otherUsers, setOtherUsers]=useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [selfInfo,setSelfInfo]=useState(false);

const [username, setUserName]=useState("Ada")
const [interests,setInterests]=useState(["coding","being a trendsetter"])
const [visibility, setVisibility]=useState(true)
const [lta,setLta]=useState("")

const [changeLTA, setChangeLTA] = useState(false);
const [inputValue, setInputValue] = useState(lta);
const [searchTerm, setSearchTerm] = useState(""); // Search input
const [searchResults, setSearchResults] = useState([]); // Geocoding results


const handleChange = () => {
  setVisibility(!visibility);
  if(!visibility){
    window.location.reload();
  } else{
    setOtherUsers([])
  }
  
};
var users = [];
useEffect(() => {
  console.log("Selected user:", selectedUser);
}, [selectedUser]);
useEffect(() => {
  // Check if geolocation is available
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: 15, // Zoom level to focus on the user's location
        }));
        users= await axios.get("http://127.0.0.1:8000/user/get_users/"+uid)
        console.log(users.data)
        setOtherUsers(users.data)

        const updatedUser=await axios.patch("http://127.0.0.1:8000/user/update_user/"+uid, {"userId":uid, "name": "Ada", "email": "lovelace@gmail.com", "interests":["coding","being a trendsetter"], "visibility":true, "lta":lta,"location": {"latitude":latitude,"longitude":longitude}})
        console.log(updatedUser)
      },
      (error) => {
        console.error('Error getting user location', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}, []);

const handleSearch = async () => {
  if (!searchTerm){
    const users= await axios.get("http://127.0.0.1:8000/user/get_users/"+uid)
    console.log(users.data)
    setOtherUsers(users.data)
    return;
  }
  

  const users=await axios.get("http://127.0.0.1:8000/user/interest/"+searchTerm+"?uid="+uid)
  console.log(users)
  if (users.data){
    setOtherUsers(users.data)
  }
  // setOtherUsers(users.data)
  console.log(users.data)
};



  return (
    
      <div style={{ width: "100vw", height: "100vh" }}>
    <ReactMapGL
    {...viewport}
    mapboxAccessToken={token}
    width="100vw"
    height="100vh"
    mapStyle={"mapbox://styles/mapbox/streets-v11"}
    onMove={(evt) => {
      setViewport(evt.viewState)
    
    }} // Handles map movements
          interactiveLayerIds={[''] }//disable
      
          
    >

      
      {userLocation && <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="bottom">
            <img src={bluePin} alt="User Location" style={{ cursor: "pointer" }} onClick={(e) => {
              e.stopPropagation();
              setSelfInfo(true);
            }} />
          </Marker>}
      <>
      <ul>
      {otherUsers && otherUsers.map((user, index) => (
          <Marker
            key={index}  // Use a unique key for each marker
            longitude={user.location.longitude}
            latitude={user.location.latitude}
            anchor="bottom"
          >
            <img src={pin} alt="User Location" style={{ cursor: "pointer" }} onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user)
            }} />
          </Marker>
        ))}
      </ul>
      </>

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          placeholder="Search interest..."
          style={{
            width: "200px",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "5px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "5px 10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>


      {selectedUser && (
        <Popup
          
          longitude={selectedUser.location.longitude}
          latitude={selectedUser.location.latitude}
          anchor='top'
          closeOnClick={true}
          onClose={() => setSelectedUser(null)} // Close popup on close button
          offset={25}
        >
          <div>
            <h3>Interests:</h3>
            <p>{selectedUser.interests.join(", ")}</p>
            <h3>I wanna talk about...</h3>
            <p>{selectedUser.lta}</p>

            
          </div>
        </Popup>)}

        {selfInfo && (
        <Popup
          
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          anchor='top'
          closeOnClick={true}
          onClose={() => setSelfInfo(false)} // Close popup on close button
          offset={25}
        >
          <div>
            <h2>{username}</h2>
            <h3>Interests:</h3>
            <p>{interests.join(", ")}</p>
            <h3>I wanna talk about...</h3>
            <p>{lta}</p>
            <FontAwesomeIcon icon={faPen} onClick={(e) => {
              setChangeLTA(true)
            }} />
            <p><b>Visibility: </b>{visibility ? "Visible" : "Hidden"}</p>
            <button
              onClick={handleChange}
              style={{
                padding: "5px 10px",
                backgroundColor: visibility ? "green" : "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            ></button>

            

            

            
          </div>
        </Popup>)}

        {changeLTA
        && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
          
          <div >
            <h1>Change your "Let's Talk About...."</h1>
          <textarea
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setLta(e.target.value)
              }}
              
              placeholder="Type here..."
              style={{ width: "95%", padding: "8px", height: "100px", margin: "10px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}></div>
            <button
              onClick={()=>{
                setChangeLTA(false)
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Change
            </button>
            </div>
          </div>
          )}




      </ReactMapGL>

  <></>
  </div>
    
  );
}

//"mapbox://styles/sumedha-kun/cm6cws1s0004u01sk09oy2kv2"
