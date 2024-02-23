import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
 const [showRegister, setShowRegister] = useState(true)
 const [activeNavPage, setActiveNavPage] = useState("BoardPage")
 const auth = JSON.parse(localStorage.getItem("user"))
 const [highPriority, setHighPriority] = useState([0])
 const [moderatePriority, setModeratePriority] = useState([0])
 const [lowPriority, setLowPriority] = useState([0])




 const handleShareOptionClick = async (todoId) => {

  try {
    let fullUrl = `${window.location.origin}/live-page/${todoId}`;
    await navigator.clipboard.writeText(fullUrl);
    console.log(fullUrl);
    alert("URL copied to clipboard!");
  } catch (err) {
    // Log the error
    console.error("Error copying to clipboard:", err);
    console.log("URL is not copied");
  }
};


 const fetchHighPriority=()=>{
  const userToken = auth.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };
  axios
    .get(`http://localhost:4000/highPriority`, {headers})
    .then((response) => {
      console.log('High priority', response.data);
      setHighPriority(response.data)
    })
    .catch((error) => {
      console.error('Error  fetching High priority:', error);
    });
}

const fetchModeratePriority=()=>{
  const userToken = auth.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };
  axios
    .get(`http://localhost:4000/moderatePriority`, {headers})
    .then((response) => {
      console.log('Moderate priority', response.data);
      setModeratePriority(response.data)
    })
    .catch((error) => {
      console.error('Error fetching Moderate priority:', error);
    });
}

const fetchLowPriority=()=>{
  const userToken = auth.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };
  axios
    .get(`http://localhost:4000/lowPriority`, {headers})
    .then((response) => {
      console.log('Low priority', response.data);
      setLowPriority(response.data)
    })
    .catch((error) => {
      console.error('Error fetching Low priority:', error);
    });
}

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
        activeNavPage,
        fetchHighPriority,
        highPriority,
        fetchModeratePriority,
        moderatePriority,
        fetchLowPriority,
        lowPriority,
        handleShareOptionClick,

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
