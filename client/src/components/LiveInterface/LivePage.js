import React, { useEffect, useState } from 'react'
import { GoDotFill } from "react-icons/go";
import logo from "../../assets/logo.png";
import "./livePage.scss"
import axios from 'axios';
import { useParams } from 'react-router-dom';
const LivePage = () => {
    const [todoData, setTodoData]= useState([]);
    const auth = JSON.parse(localStorage.getItem("user"));
    const { todoId } = useParams();

   

    const singleTodoCard = () => {
        const userToken = auth.token;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        };
      
        axios
          .get(`http://localhost:4000/getSingleTodo/${todoId}`, { headers })
          .then((response) => {
            // Check if the response has a 'data' property and a 'todo' property
            if (response.data && response.data.todo) {
              setTodoData(response.data.todo);
            } else {
              console.error("Invalid response format:", response);
            }
          })
          .catch((error) => {
            console.error("Error fetching todo data:", error);
          });
      };
      

    useEffect(()=>{
        singleTodoCard();
    },[])


  return (
    <>
    <section className='livepage-container'>
    <div className="heading">
          <img src={logo} alt="" width="30px" height="30px" />
          <h1>Pro Manage</h1>
        </div>
        <div className='todo-container'>
            <div className='todo-box'>
                <div className='priority-box'>
                <p><GoDotFill />Backlog Tasks</p>
                </div>
                <div className='todo-name'>
                    <p>Hero Sction</p>
                </div>
                <div className='checklist-box'>
                    <p>Checklist (0/3)</p>
                </div>
                <div className='todo-lists'>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                   
                </div>
                <div className='date-box'>
                    <p>Due Date</p>
                    <p>Feb 10th</p>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default LivePage