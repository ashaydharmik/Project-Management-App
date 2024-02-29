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
  const [isPastDueDate, setIsPastDueDate] = useState(false);
  const [isCompletedTodo, setIsCompletedTodo] = useState(false);

  const handleMoveCardInSection = (section) => {
    const formattedSection = section.toLowerCase();
    const sectionMappings = {
      todo: "todo",
      "to-do": "todo",
      backlog: "backlog",
      progress: "progress",
      done: "done",
    };
    onMove(todo._id, sectionMappings[formattedSection]);
  };

  const handleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionClick = () => {
    openModal(todo._id);
    setShowDropdown(false);
  };

  const handleDeleteOptionClick = () => {
    setDeleteTodoId(todo._id);
    setDeleteModalOpen(true);
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
      const isPast =
        dueDate < today && dueDate.toDateString() !== today.toDateString();
      setIsPastDueDate(isPast);

      const isDone = todo.section === "done";
      setIsCompletedTodo(isDone);
    }
  }, [todo, todo?.section]);

  const handleToggleLists = (e) => {
    e.stopPropagation();
    onToggleExpansion();
  };

  const handleCheckItem = (itemIndex) => {
    const updatedTodo = { ...todo };
    updatedTodo.checklist[itemIndex].done = true;
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    axios
      .put(
        `https://project-management-app-5swq.onrender.com/updateTodo/${updatedTodo._id}`,
        updatedTodo,
        {
          headers,
        }
      )
      .then((res) => {
        console.log(res);
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
                {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
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
