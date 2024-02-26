import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
    toast.success("URL copied to clipboard!");
  } catch (err) {
    // Log the error
    console.error("Error copying to clipboard:", err);
    console.log("URL is not copied");
  }
};

//priority api call

 const fetchHighPriority=()=>{
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


//task api call
const fetchBacklogTodoTask=()=>{
  axios
    .get(`http://localhost:4000/backlogTodoTask`, {headers})
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
    .get(`http://localhost:4000/completedTodoTask`, {headers})
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
    .get(`http://localhost:4000/currentTodoTask`, {headers})
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
    .get(`http://localhost:4000/progressTodoTask`, {headers})
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
    .get(`http://localhost:4000/dueDateTodoTask`, {headers})
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
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            width: "350px",
            fontSize: "18px",
          },
        }}
      />
    </AppContext.Provider>
  );
};

const useGlobal = () => {
  return useContext(AppContext);
};
export { AppContext, useGlobal, AppProvider };
