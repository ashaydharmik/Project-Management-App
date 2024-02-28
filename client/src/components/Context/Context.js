import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
 const [showRegister, setShowRegister] = useState(true)
 const [activeNavPage, setActiveNavPage] = useState("BoardPage")
 const [highPriority, setHighPriority] = useState([0])
 const [moderatePriority, setModeratePriority] = useState([0])
 const [lowPriority, setLowPriority] = useState([0])
 const [backlogTodo, setBacklogTodo] = useState([0])
 const [currentTodo, setCurrentTodo] = useState([0])
 const [progressTodo, setProgressTodo] = useState([0])
 const [doneTodo, setDoneTodo] = useState([0])
 const [dueDate, setDueDate] = useState([0])


 const navigate = useNavigate();
 const auth = JSON.parse(localStorage.getItem("user")) || { token: null }
 const userToken = auth.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

 const handleShareOptionClick = async (todoId) => {

  try {
    let fullUrl = `${window.location.origin}/live-page/${todoId}`;
    await navigator.clipboard.writeText(fullUrl);
    console.log(fullUrl);
    toast.success("Link Copied");
  } catch (err) {
    // Log the error
    console.error("Error copying to clipboard:", err);
    console.log("URL is not copied");
  }
};

//priority api call

 const fetchHighPriority=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/highPriority`, {headers})
    .then((response) => {
      console.log('High priority', response.data);
      setHighPriority(response.data)
    })
    .catch((error) => {
      console.error('Error  fetching High priority:', error);
    });
}

const fetchModeratePriority=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/moderatePriority`, {headers})
    .then((response) => {
      console.log('Moderate priority', response.data);
      setModeratePriority(response.data)
    })
    .catch((error) => {
      console.error('Error fetching Moderate priority:', error);
    });
}

const fetchLowPriority=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/lowPriority`, {headers})
    .then((response) => {
      console.log('Low priority', response.data);
      setLowPriority(response.data)
    })
    .catch((error) => {
      console.error('Error fetching Low priority:', error);
    });
}


//task api call
const fetchBacklogTodoTask=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/backlogTodoTask`, {headers})
    .then((response) => {
      console.log('backlogTodoTask:', response.data);
      setBacklogTodo(response.data)
    })
    .catch((error) => {
      console.error('Error fetching backlogTodoTask:', error);
    });
}
const fetchCompletedTodoTask=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/completedTodoTask`, {headers})
    .then((response) => {
      console.log('CompletedTodoTask:', response.data);
      setDoneTodo(response.data)
    })
    .catch((error) => {
      console.error('Error fetching CompletedTodoTask:', error);
    });
}
const fetchCurrentTodoTask=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/currentTodoTask`, {headers})
    .then((response) => {
      console.log('CurrentTodoTask:', response.data);
      setCurrentTodo(response.data)
    })
    .catch((error) => {
      console.error('Error fetching CurrentTodoTask:', error);
    });
}
const fetchProgressTodoTask=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/progressTodoTask`, {headers})
    .then((response) => {
      console.log('ProgressTodoTask:', response.data);
      setProgressTodo(response.data)
    })
    .catch((error) => {
      console.error('Error fetching ProgressTodoTask:', error);
    });
}

const fetchDueDateTodoTask=()=>{
  axios
    .get(`https://project-management-app-5swq.onrender.com/dueDateTodoTask`, {headers})
    .then((response) => {
      console.log('dueDateTodoTask:', response.data);
      setDueDate(response.data)
    })
    .catch((error) => {
      console.error('Error fetching dueDateTodoTask:', error);
    });
}



 const showLoginForm =()=>{
  setShowRegister(false)
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
        navigate,
        showLoginForm,
        showRegister,
        setShowRegister,
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
        backlogTodo,
        fetchBacklogTodoTask,
        currentTodo,
        fetchCurrentTodoTask,
        progressTodo,
        fetchProgressTodoTask,
        doneTodo,
        fetchCompletedTodoTask,
        dueDate,
        fetchDueDateTodoTask
      }}
    >
      {children}
      <ToastContainer
      position="top-right"
      autoClose={2000}
      />
    </AppContext.Provider>
    
  );
};

const useGlobal = () => {
  return useContext(AppContext);
};
export { AppContext, useGlobal, AppProvider };
