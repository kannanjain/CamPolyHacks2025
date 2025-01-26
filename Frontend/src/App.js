import pin from './pin.png';
import 'mapbox-gl/dist/mapbox-gl.css'; 

// import './App.css';
// import React, {useState} from 'react'

// const apikey = 'Dw0lbjMhf7hr1K_uQRkHWHMTaqedDkhw9zaYdgLpHMU'

// function App() {

//   return (
//     <div className="App">
//       <div>
//             <Map apikey={apikey} />
//         </div>
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p> */
// /*         
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";


import ReactMapGL, { Marker, Popup } from "react-map-gl";

const token="pk.eyJ1Ijoic3VtZWRoYS1rdW4iLCJhIjoiY202Y3YzZDl5MG1qYjJsb29oZG05ZzNrdyJ9.znQxXNQe-ze2jFZbgdYcvw"

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 35.300475,
    longitude: -120.662046,
zoom: 15});
const [userLocation, setUserLocation] = useState(null);
useEffect(() => {
  // Check if geolocation is available
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position")
        console.log(position)
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: 9, // Zoom level to focus on the user's location
        }));
        console.log(latitude)
        console.log(longitude)
        console.log("Viewport Center:", viewport.latitude, viewport.longitude);
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
      console.log(viewport)
    
    }} // Handles map movements
          interactiveLayerIds={[''] }//disable
    >
      {userLocation && <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="bottom">
            <img src={pin} />
          </Marker>}
      </ReactMapGL>

  <></>
  </div>
    
  );
}

//"mapbox://styles/sumedha-kun/cm6cws1s0004u01sk09oy2kv2"
