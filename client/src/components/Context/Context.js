import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
 const [showRegister, setShowRegister] = useState(true)

 const showLoginForm =()=>{
  setShowRegister(false)
 }


  return (
    <AppContext.Provider
      value={{
        navigate,
        showLoginForm,
        showRegister,
        setShowRegister
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
