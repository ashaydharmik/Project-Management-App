import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import "./createdCard.scss";
import axios from "axios";
import DeleteModal from "../../../Modal/DeleteModal/DeleteModal";
import { useGlobal } from "../../../Context/Context";

const CreatedCard = ({ openModal, globalCollapse, onMove, todo }) => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListCollapsed, setListCollapsed] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const { handleShareOptionClick } = useGlobal();

  const handleMoveCardInSection = (section) => {
    // Call the moveCard prop to notify the parent component about the card movement
    onMove(todo._id, section);
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

  const handleToggleLists = (e) => {
    e.stopPropagation();
    setListCollapsed((prev) => !prev);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#63C05B";
      case "moderate":
        return "#18B0FF";
      case "high":
        return "red";
      default:
        return "black";
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
                {isListCollapsed ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </p>
            </div>
          </div>
          {isListCollapsed && (
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
                <button id="dateBtn">
                  {new Date(todo.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </button>
              )}
            </div>
            <div className="section-btn">
              <button onClick={() => handleMoveCardInSection("backlog")}>
                Backlog
              </button>
              <button onClick={() => handleMoveCardInSection("progress")}>
                Progress
              </button>
              <button onClick={() => handleMoveCardInSection("done")}>
                Done
              </button>
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
      />
    </>
  );
};

export default CreatedCard;
