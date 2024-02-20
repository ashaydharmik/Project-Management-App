import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import "./createdCard.scss";
import axios from "axios";
const CreatedCard = () => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodoData, setSingleTodoData] = useState([]);

  const handleShowTodo = () => {
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    axios
      .get("http://localhost:4000/getAllTodo", { headers })
      .then((res) => {
        const todoArray = Object.values(res.data.todo);
        setSingleTodoData(todoArray);
        console.log(singleTodoData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleShowTodo(); // Log the updated state here
  }, []); // Run this effect whenever singleTodoData changes

  return (
    <>
    <div className="cards">
     {singleTodoData.length > 0 ? (
        singleTodoData.map((todo, id) => (
          <div key={id}>
            <div className='created-card-heading'>
              <p><GoDotFill />{todo.priority}</p>
              <p><HiDotsHorizontal /></p>
            </div>
            <div className='created-card-title'>
              <p>{todo.taskName}</p>
            </div>
            <div className='created-card-checklist'>
              <p>Checklist ({(todo?.checklist?.filter(item => item.done) || []).length}/{(todo?.checklist || []).length})</p>
              <p><IoIosArrowUp /></p>
            </div>
            <div className='created-card-lists'>
              {(todo.checklist || []).map((item, index) => (
                <label key={index}>
                  <input type='checkbox' checked={item.done} readOnly />
                  {item.label}
                </label>
              ))}
            </div>
            <div className='created-card-buttons'>
              <button>{new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</button>
              <button>PROGRESS</button>
              <button>TO-DO</button>
              <button>DONE</button>
            </div>
          </div>
        ))
      ) : (
        <p>No todos found for the user</p>
      )}
      </div>
    </>
  );
};

export default CreatedCard;
