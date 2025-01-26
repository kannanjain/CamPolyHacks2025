import React from "react";

const Header = () => {
    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>Soul Sync</h1>
        </header>
    );
};

const headerStyle = {
    backgroundColor: "#F4F1E3", // Semi-transparent blue
    height: "70px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(230, 186, 110, 0.2)",
};

const titleStyle = {
    fontSize: "36px",
    fontFamily: "Papyrus, fantasy",
    color: "rgba(14, 67, 124, 6)",
    margin: 0,
};

export default Header;
