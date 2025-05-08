import React from "react";
import "../App.css";
import dolelogo from "../images/dolelogo.png";
import bglogo from "../images/bglogo.jpg";

const Header = () => {
  return (
    <div className="header">
      <img src={dolelogo} alt="DOLE Logo" className="dole-logo" />
      <div className="header-text">
        <p>Republic Act of the Philippines</p>
        <p><strong>DEPARTMENT OF LABOR AND EMPLOYMENT</strong></p>
        <p>Regional Office No. X</p>
        <p>Northern Mindanao</p>
      </div>
      <img src={bglogo} alt="Background Logo" className="bg-logo" />
    </div>
  );
};

export default Header;