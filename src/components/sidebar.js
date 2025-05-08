import React from "react";
import { Link } from "react-router-dom";
import { FaPeopleRobbery } from "react-icons/fa6";
import { TbHeartRateMonitor } from "react-icons/tb";
import { MdFormatListNumbered } from "react-icons/md";
import "../App.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="navigations">
        <ul>
        <li>
        <Link to="#">

              <span className="icon"><TbHeartRateMonitor /></span>
              <span className="title">GAM</span>
          </Link>

          </li>
          <li>
            <Link to="/gip">
              <span className="icon"><FaPeopleRobbery /></span>
              <span className="title">GIP</span>
            </Link>
          </li>
          <li>
            <Link to="/adl">
              <span className="icon"><MdFormatListNumbered  /></span>
              <span className="title">ADL LIST</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
