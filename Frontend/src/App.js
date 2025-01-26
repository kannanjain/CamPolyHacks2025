// import logo from './logo.svg';
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
    // height: "300vh",
    // center: [-0.1404545, 51.5220163],
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);

  

  return (
    <div class="body">
      <div class="map">
      <ReactMapGL
      {...viewport}
      mapboxAccessToken={token}
      width="100vw"
      height="100vh"
      mapStyle={"mapbox://styles/sumedha-kun/cm6cws1s0004u01sk09oy2kv2"}
      >
      </ReactMapGL>

      <></>
    </div>
    </div>
    
  );
}