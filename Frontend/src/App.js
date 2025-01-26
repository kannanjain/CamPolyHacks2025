import pin from './pin.png';
import bluePin from './bluepin.png';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import axios from 'axios'

import React, { useState, useEffect } from "react";


import ReactMapGL, { Marker, Popup } from "react-map-gl";

const token="pk.eyJ1Ijoic3VtZWRoYS1rdW4iLCJhIjoiY202Y3YzZDl5MG1qYjJsb29oZG05ZzNrdyJ9.znQxXNQe-ze2jFZbgdYcvw"

export default function App() {
  const [viewport, setViewport] = useState({
  latitude: 35.300475,
  longitude: -120.662046,
zoom: 15});
const [userLocation, setUserLocation] = useState(null);
const [otherUsers, setOtherUsers]=useState([]);
var users = [];
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
          zoom: 9, // Zoom level to focus on the user's location
        }));
        users= await axios.get("http://127.0.0.1:8000/user/get_users")
        console.log(users.data)
        setOtherUsers(users.data)
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
            <img src={bluePin} />
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
            <img src={pin} alt="User Location" />
          </Marker>
        ))}
      </ul>
      {/* {otherUsers && otherUsers.map((user, index) => (
        <Marker
          key={index}
          longitude={user.location.longitude}
          latitude={user.location.latitude}
          anchor="bottom"
        >
          <img src={pin} alt="User Location" />
        </Marker>
      ))} */}
      </>

      </ReactMapGL>

  <></>
  </div>
    
  );
}

//"mapbox://styles/sumedha-kun/cm6cws1s0004u01sk09oy2kv2"
