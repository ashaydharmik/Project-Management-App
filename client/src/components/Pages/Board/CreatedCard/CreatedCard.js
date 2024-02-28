import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import "./createdCard.scss";
import axios from "axios";
import DeleteModal from "../../../Modal/DeleteModal/DeleteModal";
import { useGlobal } from "../../../Context/Context";


const CreatedCard = ({
  openModal,
  globalCollapse,
  onMove,
  todo,
  fetchData,
  isExpanded,
  onToggleExpansion,
}) => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListCollapsed, setListCollapsed] = useState({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const { handleShareOptionClick } = useGlobal();
  // Add this state variable at the beginning of the component
  const [isPastDueDate, setIsPastDueDate] = useState(false);
  const [isCompletedTodo, setIsCompletedTodo] = useState(false);

  const handleMoveCardInSection = (section) => {
    // Convert the section name to lowercase
    const formattedSection = section.toLowerCase();
    
    // Map the section names to match the backend
    const sectionMappings = {
      "todo": "todo",
      "to-do": "todo",  // Add this mapping if needed
      "backlog": "backlog",
      "progress": "progress",
      "done": "done",
    };
  
    // Pass the correct section name to the onMove function
    onMove(todo._id, sectionMappings[formattedSection]);
  };

  const handleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionClick = () => {
    // Open the modal when clicking on Edit
    openModal(todo._id);
    // Close the dropdown
    setShowDropdown(false);
  };

  const handleDeleteOptionClick = () => {
    // Set the deleteTodoId and open the delete modal
    setDeleteTodoId(todo._id);
    setDeleteModalOpen(true);
    // Close the dropdown
    setShowDropdown(false);
  };

  useEffect(() => {
    if (todo) {
      setListCollapsed((prev) => ({
        ...prev,
        [todo._id]: false,
      }));
  
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      
      // Set isPast to true if the dueDate is before today's date
      const isPast = dueDate < today && dueDate.toDateString() !== today.toDateString();
      setIsPastDueDate(isPast);
  
      const isDone = todo.section === "done";
      setIsCompletedTodo(isDone);
    }
  }, [todo, todo?.section]);
  // Include todo?.section in the dependencies
   // Include todo?.section in the dependencies

  // const handleToggleLists = (e) => {
  //   e.stopPropagation();
  //   setListCollapsed((prev) => ({
  //     ...prev,
  //     [todo._id]: !prev[todo._id],
  //   }));
  // };
  const handleToggleLists = (e) => {
    e.stopPropagation();
    onToggleExpansion();
  };

  const handleCheckItem = (itemIndex) => {
    // Update local state
    const updatedTodo = { ...todo };
    updatedTodo.checklist[itemIndex].done = true;

    // Update the database
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    axios
      .put(`https://project-management-app-5swq.onrender.com/updateTodo/${updatedTodo._id}`, updatedTodo, {
        headers,
      })
      .then((res) => {
        console.log(res);
        // Handle the response or update local state as needed
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#63C05B";
      case "moderate":
        return "#18B0FF";
      case "high":
        return "#FF2473";
      default:
        return "black";
    }
  };

  const generateSectionButtons = (currentSection) => {
    switch (currentSection) {
      case "todo":
        return ["BACKLOG", "PROGRESS", "DONE"];
      case "backlog":
        return ["PROGRESS", "TO-DO", "DONE"];
      case "progress":
        return ["BACKLOG", "TO-DO", "DONE"];
      case "done":
        return ["BACKLOG", "TO-DO", "PROGRESS"];
      default:
        return [];
    }
  };

  return (
    <>
      {todo ? (
        <div className="cards">
          <div className="created-card-heading">
            <p>
              <GoDotFill style={{ color: getPriorityColor(todo.priority) }} />
              {todo.priority}
            </p>
            <p onClick={handleDropdown}>
              <HiDotsHorizontal />
            </p>
            {showDropdown && (
              <div className="dropdown-content">
                <p onClick={handleOptionClick}>Edit</p>
                <p onClick={() => handleShareOptionClick(todo._id)}>Share</p>
                <p onClick={handleDeleteOptionClick}>Delete</p>
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
              <p onClick={handleToggleLists}>
                {isExpanded ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </p>
            </div>
          </div>
          {isExpanded && (
            <div className="created-card-lists">
              {(todo.checklist || []).map((item, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleCheckItem(index)}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          )}

          <div className="created-card-buttons">
            <div className="date-btn">
              {todo.dueDate && (
                <button
                  id="dateBtn"
                  style={{
                    backgroundColor: isCompletedTodo
                      ? "#63C05B"
                      : isPastDueDate
                      ? "#CF3636"
                      : "#DBDBDB",
                    color: isCompletedTodo
                      ? "white"
                      : isPastDueDate
                      ? "white"
                      : "#767575",
                  }}
                >
                  {new Date(todo.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </button>
              )}
            </div>
            <div className="section-btn">
              {generateSectionButtons(todo.section).map(
                (sectionName, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleMoveCardInSection(sectionName.toLowerCase())
                    }
                  >
                    {sectionName}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Please Create some Todos...</p>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteOptionClick}
        todoId={deleteTodoId}
        fetchData={fetchData}
      />

    </>
  );
};

export default CreatedCard;
