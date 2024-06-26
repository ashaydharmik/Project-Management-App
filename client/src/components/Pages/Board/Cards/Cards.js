import React, { useEffect, useState } from "react";
import "./cards.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreatedCard from "../CreatedCard/CreatedCard";
import Modal from "react-modal";
import TodoModal from "../../../Modal/TodoModal/TodoModal";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";

const Cards = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodo, setSingleTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [section, setSection] = useState(null);
  const [selectedOption, setSelectedOption] = useState("This Week");
  const [isGlobalCollapse, setGlobalCollapse] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [expandedTodos, setExpandedTodos] = useState({
    backlog: [],
    todo: [],
    progress: [],
    done: [],
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const openModal = (todoId, section) => {
    if (todoId !== null && todoId !== undefined) {
      getSingleTodoData(todoId);
    } else {
      setSingleTodo(null);
    }

    setModalOpen(true);
    setSection(section);
    setSelectedTodoId(todoId);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const customStyles = {
    content: {
      position: "fixed",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      width: "45%",
      height: "70%",
      borderRadius: "10px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const getSingleTodoData = async (todoId) => {
    try {
      if (todoId === null || todoId === undefined) {
        setSingleTodo(null);
        setModalOpen(true);
        return;
      }

      const userToken = auth.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axios.get(
        `https://project-management-app-5swq.onrender.com/live-page/${todoId}`,
        { headers }
      );
      setSingleTodo(response.data.availableTodo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTodo = (updatedTodo) => {
    if (selectedTodoId) {
      const userToken = auth.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };

      axios
        .put(
          `https://project-management-app-5swq.onrender.com/updateTodo/${selectedTodoId}`,
          updatedTodo,
          { headers }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.error("SelectedTodoId is null");
    }
  };

  const fetchData = async () => {
    try {
      const userToken = auth.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axios.get(
        `https://project-management-app-5swq.onrender.com/getAllTodo?selectedOption=${selectedOption}`,
        {
          headers,
        }
      );
      const sections = Object.keys(response.data);
      let allTodos = [];
      sections.forEach((section) => {
        const todosInSection = response.data[section];
        allTodos = allTodos.concat(todosInSection);
      });
      setTodos(allTodos);
    } catch (error) {
      console.error("Error fetching todo data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth.token, selectedOption]);

  const moveCard = async (todoId, targetColumn) => {
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    try {
      const todoToMove = todos.find((todo) => todo._id === todoId);

      await axios.put(
        `https://project-management-app-5swq.onrender.com/updateTodo/${todoId}`,
        { ...todoToMove, section: targetColumn },
        { headers }
      );

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === todoId) {
            return { ...todo, section: targetColumn };
          }
          return todo;
        });
      });

      fetchData();
    } catch (error) {
      console.error("Error moving todo:", error);
    }
  };

  const handleGlobalCollapse = () => {
    setGlobalCollapse((prev) => !prev);

    setExpandedTodos({
      backlog: [],
      todo: [],
      progress: [],
      done: [],
    });
  };

  const toggleTodoExpansion = (section, todoId) => {
    setExpandedTodos((prevExpandedTodos) => {
      const sectionExpansions = [...prevExpandedTodos[section]];
      const todoIndex = sectionExpansions.indexOf(todoId);

      if (todoIndex === -1) {
        sectionExpansions.push(todoId);
      } else {
        sectionExpansions.splice(todoIndex, 1);
      }

      return {
        ...prevExpandedTodos,
        [section]: sectionExpansions,
      };
    });
  };

  return (
    <>
      <div className="cards-container">
        <div className="board-title-filter-container">
          <h1>Board</h1>
          <div className="custom-dropdown">
            <div
              className="selected-option"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedOption}</span>
              <span>
                <IoIosArrowDown />
              </span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <p onClick={() => handleOptionChange("Today")}>Today</p>
                <p onClick={() => handleOptionChange("This Week")}>This Week</p>
                <p onClick={() => handleOptionChange("This Month")}>
                  This Month
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="cards-box-container">
          <div className="card-box">
            <div className="card-title">
              <p>Backlog</p>
              <p>
                <VscCollapseAll
                  onClick={() => handleGlobalCollapse("backlog")}
                />
              </p>
            </div>
            <div className="card backlog-section">
              {todos.length > 0 ? (
                todos
                  .filter((todo) => todo.section === "backlog")
                  .map((todo) => (
                    <CreatedCard
                      key={todo._id}
                      todo={todo}
                      onMove={moveCard}
                      globalCollapse={handleGlobalCollapse}
                      setGlobalCollapse={setGlobalCollapse}
                      openModal={() => openModal(todo._id, todo.section)}
                      fetchData={fetchData}
                      isExpanded={expandedTodos.backlog.includes(todo._id)}
                      onToggleExpansion={() =>
                        toggleTodoExpansion("backlog", todo._id)
                      }
                    />
                  ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>To do</p>
              <p>
                <IoMdAdd onClick={() => openModal(null)} />
                <VscCollapseAll onClick={() => handleGlobalCollapse("todo")} />
              </p>
            </div>
            <div className="card todo-section">
              {todos.length > 0 ? (
                todos
                  .filter((todo) => todo.section === "todo")
                  .map((todo) => (
                    <CreatedCard
                      key={todo._id}
                      todo={todo}
                      onMove={moveCard}
                      globalCollapse={handleGlobalCollapse}
                      setGlobalCollapse={setGlobalCollapse}
                      openModal={() => openModal(todo._id, todo.section)}
                      fetchData={fetchData}
                      isExpanded={expandedTodos.todo.includes(todo._id)}
                      onToggleExpansion={() =>
                        toggleTodoExpansion("todo", todo._id)
                      }
                    />
                  ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>In Progress</p>
              <p>
                <VscCollapseAll
                  onClick={() => handleGlobalCollapse("progress")}
                />
              </p>
            </div>
            <div className="card todo-section">
              {todos.length > 0 ? (
                todos
                  .filter((todo) => todo.section === "progress")
                  .map((todo) => (
                    <CreatedCard
                      key={todo._id}
                      todo={todo}
                      onMove={moveCard}
                      globalCollapse={handleGlobalCollapse}
                      setGlobalCollapse={setGlobalCollapse}
                      openModal={() => openModal(todo._id, todo.section)}
                      fetchData={fetchData}
                      isExpanded={expandedTodos.progress.includes(todo._id)}
                      onToggleExpansion={() =>
                        toggleTodoExpansion("progress", todo._id)
                      }
                    />
                  ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>Done</p>
              <p>
                <VscCollapseAll onClick={() => handleGlobalCollapse("done")} />
              </p>
            </div>
            <div className="card todo-section">
              {todos.length > 0 ? (
                todos
                  .filter((todo) => todo.section === "done")
                  .map((todo) => (
                    <CreatedCard
                      key={todo._id}
                      todo={todo}
                      onMove={moveCard}
                      globalCollapse={handleGlobalCollapse}
                      setGlobalCollapse={setGlobalCollapse}
                      openModal={() => openModal(todo._id, todo.section)}
                      fetchData={fetchData}
                      isExpanded={expandedTodos.done.includes(todo._id)}
                      onToggleExpansion={() =>
                        toggleTodoExpansion("done", todo._id)
                      }
                    />
                  ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Todo Modal"
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <TodoModal
          closeModal={closeModal}
          updateTodo={handleUpdateTodo}
          selectedTodoId={selectedTodoId}
          singleTodo={singleTodo}
          section={section}
          fetchData={fetchData}
        />
      </Modal>
    </>
  );
};

export default Cards;
