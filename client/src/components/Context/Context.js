import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
 const [showRegister, setShowRegister] = useState(true)
 const [activeNavPage, setActiveNavPage] = useState("BoardPage")
 const auth = JSON.parse(localStorage.getItem("user"))



 const showLoginForm =()=>{
  setShowRegister(false)
 }

const handleLogout=()=>{
 if(auth){
   localStorage.clear();
   navigate("/")
 }
}

const handleBoardClick =()=>{
  setActiveNavPage("BoardPage")
}
const handleAnalyticsClick =()=>{
  setActiveNavPage("AnalyticsPage")
}
const handleSettingsClick =()=>{
  setActiveNavPage("SettingsPage")
}



  return (
    <AppContext.Provider
      value={{
        // setAuthToken,
        // token,
        navigate,
        showLoginForm,
        showRegister,
        setShowRegister,
        handleLogout,
        handleBoardClick,
        handleAnalyticsClick,
        handleSettingsClick,
        activeNavPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobal = () => {
  return useContext(AppContext);
};
export { AppContext, useGlobal, AppProvider };
