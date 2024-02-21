import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import "./createdCard.scss";
import axios from "axios";
const CreatedCard = ({ openModal, collapseLists  }) => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodoData, setSingleTodoData] = useState([]);
  const [showDropdown, setShowDropdown] = useState([]);
  const [isListCollapsed, setListCollapsed] = useState(false);

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
    handleShowTodo();
  }, []);

  const handleDropdown = (index) => {
    setShowDropdown((prev) => {
      const newShowDropdown = [...prev];
      newShowDropdown[index] = !newShowDropdown[index];
      return newShowDropdown;
    });
  };

  const handleOptionClick = (todoId, index) => {
    // Close the dropdown by setting showDropdown to false
    setShowDropdown((prev) => {
      const newShowDropdown = [...prev];
      newShowDropdown[index] = false;
      return newShowDropdown;
    });

    // Open the modal after closing the dropdown
    openModal(todoId);
  };

  const handleToggleLists = () => {
    setListCollapsed((prev) => !prev);
  };

  return (
    <>
      {singleTodoData.length > 0 ? (
        singleTodoData.map((todo, id) => (
          <div className="cards">
            <div className="created-card-heading">
              <p>
                <GoDotFill />
                {todo.priority}
              </p>
              <p onClick={() => handleDropdown(id)}>
                <HiDotsHorizontal />
              </p>
              {showDropdown[id] && (
                <div className="dropdown-content">
                  <p onClick={() => handleOptionClick(todo._id, id)}>Edit</p>
                  <p>Share</p>
                  <p>Delete</p>
                </div>
              )}
            </div>
            <div className="created-card-title">
              <p>{todo.taskName}</p>
            </div>
            <div className="created-card-checklist">
              <p>
                Checklist (
                {(todo?.checklist?.filter((item) => item.done) || []).length}/
                {(todo?.checklist || []).length})
              </p>
              <p onClick={() => handleToggleLists()}>
              {isListCollapsed ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </p>
              
            </div>
           
            {(!collapseLists || !isListCollapsed) && (
              <div className="created-card-lists">
                {(todo.checklist || []).map((item, index) => (
                  <label key={index}>
                    <input type="checkbox" checked={item.done} readOnly />
                    {item.label}
                  </label>
                ))}
              </div>
            )}
          
            <div className="created-card-buttons">
              <div className="date-btn">
                {todo.dueDate && (
                  <button id="dateBtn">
                    {new Date(todo.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                )}
              </div>
              <div className="section-btn">
                <button>PROGRESS</button>
                <button>TO-DO</button>
                <button>DONE</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No todos found for the user</p>
      )}
    </>
  );
};

export default CreatedCard;
