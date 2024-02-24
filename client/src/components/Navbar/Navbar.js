import React, { useState } from "react";
import "./navbar.scss";
import logo from "../../assets/logo.png";
import board from "../../assets/board-img.png";
import analytics from "../../assets/analytics-img.png";
import setting from "../../assets/setting-img.png";
import { IoLogOutOutline } from "react-icons/io5";
import { useGlobal } from "../Context/Context";
import LogoutModal from "../Modal/LogoutModal/LogoutModal";


const Navbar = () => {
  const { 
    handleBoardClick,
    handleAnalyticsClick,
    handleSettingsClick,
    activeNavPage} = useGlobal();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
      setIsLogoutModalOpen(true);
    };
  
    const handleCloseLogoutModal = () => {

      setIsLogoutModalOpen(false);
    };
   

  return (
    <>
      <div className="nav-items-container">
        <div className="heading">
          <img src={logo} alt="" width="30px" height="30px" />
          <h1>Pro Manage</h1>
        </div>
        <div className="nav-menu">
          <button onClick={handleBoardClick} className={activeNavPage === "BoardPage" ? "active" : ""}>
            <img src={board} alt="" />
            <span>Board</span>
          </button>
          <button onClick={handleAnalyticsClick} className={activeNavPage === "AnalyticsPage" ? "active" : ""}>
            <img src={analytics} alt="" />
            <span>Analytics</span>
          </button>
          <button onClick={handleSettingsClick} className={activeNavPage === "SettingsPage" ? "active" : ""}>
            <img src={setting} alt="" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="logout-container">
        <p onClick={handleLogoutClick}> 
          <IoLogOutOutline />
          <span>Log out</span>
        </p>
      </div>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={handleCloseLogoutModal} />
    </>
  );
};

export default Navbar;
