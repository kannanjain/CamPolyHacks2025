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
const [lta,setLta]=useState("How programming was actually a women dominated field and then men joined when it became lucrative.")

const [changeLTA, setChangeLTA] = useState(false);
const [inputValue, setInputValue] = useState(lta);

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

        const updatedUser=await axios.patch("http://127.0.0.1:8000/user/update_user/"+uid, {"userId":uid, "name": "Ada", "email": "lovelace@gmail.com", "interests":["coding","being a trendsetter"], "visibility":true, "lta":"How programming was actually a women dominated field and then men joined when it became lucrative.","location": {"latitude":latitude,"longitude":longitude}})
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

        {changeLTA && (
        <Popup
          
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          anchor='top'
          closeOnClick={true}
          onClose={() => setChangeLTA(false)} // Close popup on close button
          offset={25}
        >
          <div>
          <div>
            <h1>Change your "Let's Talk About...."</h1>
          <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setLta(e.target.value)
              }}
              placeholder="Type here..."
              style={{ width: "100%", padding: "5px" }}
            />
          </div>

            
          </div>
        </Popup>)}




      </ReactMapGL>

  <></>
  </div>
    
  );
}

//"mapbox://styles/sumedha-kun/cm6cws1s0004u01sk09oy2kv2"
