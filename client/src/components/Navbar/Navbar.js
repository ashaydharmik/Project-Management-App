import React from 'react'
import "./navbar.scss"
import logo from "../../assets/logo.png"
import board from "../../assets/board-img.png"
import analytics from "../../assets/analytics-img.png"
import setting from "../../assets/setting-img.png"
import { IoLogOutOutline } from "react-icons/io5";
import { useGlobal } from '../Context/Context'
const Navbar = () => {
    const {handleLogout} = useGlobal();
  return (
    <>
    <div className='nav-items-container'>
        <div className='heading'>
        <img src={logo} alt='' width='30px' height="30px"/> 
            <h1>Pro Manage</h1>
        </div>
        <div className='nav-menu'>
            <button>
       
            <img src={board} alt=''/>
                <span>Board</span>
                </button>
            <button>
            <img src={analytics} alt=''/>
                <span>Analytics</span></button>
            <button>
            <img src={setting} alt=''/>
                <span>Settings</span>
                </button>
        </div>
    </div>
    <div className='logout-container'>
        <p onClick={handleLogout}>
    <IoLogOutOutline />
<span>Log out</span>
        </p>
    </div>
    </>
  )
}

export default Navbar