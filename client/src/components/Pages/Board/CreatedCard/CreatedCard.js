import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import "./createdCard.scss";
import axios from "axios";
import DeleteModal from "../../../Modal/DeleteModal/DeleteModal";
import { useGlobal } from "../../../Context/Context";



const CreatedCard = ({ openModal, globalCollapse }) => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodoData, setSingleTodoData] = useState([]);
  const [showDropdown, setShowDropdown] = useState([]);
  const [isListCollapsed, setListCollapsed] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);
const {handleShareOptionClick} = useGlobal()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = auth.token;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        };
        const response = await axios.get("http://localhost:4000/getAllTodo", {
          headers,
        });
        const todoArray = Object.values(response.data.todo);
        setSingleTodoData(todoArray);
        // Initialize isListCollapsed with false for each todo item
        setListCollapsed(Array(todoArray.length).fill(false));
      } catch (error) {
        console.error("Error fetching todo data:", error);
      }
    };
    fetchData();
  }, [auth.token, openModal, isDeleteModalOpen]);

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

  const handleToggleLists = (index, e) => {
    e.stopPropagation();
    setListCollapsed((prev) => {
      const newListCollapsed = [...prev];
      newListCollapsed[index] = !newListCollapsed[index];
      return newListCollapsed;
    });
  };

  useEffect(() => {
    // Update isListCollapsed when globalCollapse changes
    setListCollapsed(Array(singleTodoData.length).fill(globalCollapse));
  }, [globalCollapse, singleTodoData]);

  const handleCheckItem = (cardIndex, itemIndex) => {
    setSingleTodoData((prevData) => {
      const updatedData = [...prevData];
      updatedData[cardIndex].checklist[itemIndex].done = true;
      return updatedData;
    });

    // Update the database
    const updatedTodo = { ...singleTodoData[cardIndex] };
    updatedTodo.checklist[itemIndex].done = true;

    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    axios
      .put(`http://localhost:4000/updateTodo/${updatedTodo._id}`, updatedTodo, {
        headers,
      })
      .then((res) => {
        console.log(res);
        // Handle the response or update local state as needed
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteOptionClick = (todoId, index) => {
    // Close the dropdown
    setShowDropdown((prev) => {
      const newShowDropdown = [...prev];
      newShowDropdown[index] = false;
      return newShowDropdown;
    });
  
    // Set the deleteTodoId and open the delete modal
    setDeleteTodoId(todoId);
    console.log("deleted todo id :", todoId)
    setDeleteModalOpen(true);
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return '#63C05B'; // or any color you want for low priority
      case 'moderate':
        return '#18B0FF'; // or any color you want for moderate priority
      case 'high':
        return 'red'; // or any color you want for high priority
      default:
        return 'black'; 
    }
  };
  
///share link

  

  return (
    <>
      {singleTodoData.length > 0 ? (
        singleTodoData.map((todo, id) => (
          <div className="cards">
            <div className="created-card-heading">
              <p>
                <GoDotFill style={{ color: getPriorityColor(todo.priority) }}/>
                {todo.priority}
              </p>
              <p onClick={() => handleDropdown(id)}>
                <HiDotsHorizontal />
              </p>
              {showDropdown[id] && (
                <div className="dropdown-content">
                  <p onClick={() => handleOptionClick(todo._id, id)}>Edit</p>
                  <p onClick={() => handleShareOptionClick(todo._id)}>Share</p>
                  <p onClick={() => handleDeleteOptionClick(todo._id, id)}>
                    Delete
                  </p>
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

              <div className="created-card-checklist">
                <p onClick={(e) => handleToggleLists(id, e)}>
                  {isListCollapsed[id] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </p>
              </div>
            </div>
            {isListCollapsed[id] && (
              <div className="created-card-lists">
                {(todo.checklist || []).map((item, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleCheckItem(id, index)}
                    />
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
                <button> Backlog</button>
                <button> Progress</button>
                <button> Done</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No todos found for the user</p>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => handleDeleteOptionClick()}
        todoId={deleteTodoId}
      />
    </>
  );
};

export default CreatedCard;
