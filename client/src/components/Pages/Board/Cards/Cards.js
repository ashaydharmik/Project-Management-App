import React, { useEffect, useState } from "react";
import "./cards.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreatedCard from "../CreatedCard/CreatedCard";
import Modal from "react-modal";
import TodoModal from "../../../Modal/TodoModal/TodoModal";
import axios from "axios";

const Cards = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodo, setSingleTodo] = useState(null);
  const [isGlobalCollapse, setGlobalCollapse] = useState(false);
  const [todos, setTodos] = useState([]);
  const [section, setSection] = useState(null);

  const openModal = (todoId, section) => {
    setSelectedTodoId((prevTodoId) => {
      if (todoId !== null && todoId !== undefined) {
        getSingleTodoData();
        console.log("Fetching singleTodo data...");
      } else {
        setSingleTodo(null);
      }

      setModalOpen(true);
      setSection(section);

      return todoId;
    });
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
      width: "60%",
      height: "70%",
      borderRadius: "10px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const getSingleTodoData = async () => {
    try {
      // Check if it's a new todo task
      if (selectedTodoId === null || selectedTodoId === undefined) {
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
        `http://localhost:4000/live-page/${selectedTodoId}`,
        { headers }
      );
      setSingleTodo(response.data.availableTodo);
      setModalOpen(true);
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
          `http://localhost:4000/updateTodo/${selectedTodoId}`,
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

        console.log("API Response:", response.data);

        const sections = Object.keys(response.data);
        let allTodos = [];

        sections.forEach((section) => {
          const todosInSection = response.data[section];
          allTodos = allTodos.concat(todosInSection);
        });

        console.log("All Todos:", allTodos);

        setTodos(allTodos);
      } catch (error) {
        console.error("Error fetching todo data:", error);
      }
    };

    fetchData();
  }, [auth.token]); // Include auth.token as a dependency for useEffect

  const handleGlobalCollapse = () => {
    setGlobalCollapse(!isGlobalCollapse);
  };

  const moveCard = async (todoId, targetColumn) => {
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
  
    try {
      // Retrieve the complete todo object
      const todoToMove = todos.find((todo) => todo._id === todoId);
  
      // Update the section property in the backend
      await axios.put(
        `http://localhost:4000/updateTodo/${todoId}`,
        { ...todoToMove, section: targetColumn },
        { headers }
      );
  
      // Update the section property in the local state
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === todoId) {
            return { ...todo, section: targetColumn };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error("Error moving todo:", error);
    }
  };
  

  return (
    <>
      <div className="cards-container">
        <div className="board-title-filter-container">
          <h1>Board</h1>
          <p>
            <select id="dropdown" name="dropdown">
              <option value="option1">Today</option>
              <option value="option2">This Week</option>
              <option value="option3">This Month</option>
            </select>
          </p>
        </div>
        <div className="cards-box-container">
          <div className="card-box">
            <div className="card-title">
              <p>Backlog</p>
              <p>
                <VscCollapseAll onClick={handleGlobalCollapse} />
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
                      openModal={() => openModal(todo._id, todo.section)}
                    />
                  ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>To do</p>
              <p>
                <IoMdAdd onClick={() => openModal(null)} />
                <VscCollapseAll onClick={handleGlobalCollapse} />
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
                      openModal={() => openModal(todo._id, todo.section)}
                    />
                  ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>In Progress</p>
              <p>
                <IoMdAdd onClick={() => openModal(null)} />
                <VscCollapseAll onClick={handleGlobalCollapse} />
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
                      openModal={() => openModal(todo._id, todo.section)}
                    />
                  ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>Done</p>
              <p>
                <IoMdAdd onClick={() => openModal(null)} />
                <VscCollapseAll onClick={handleGlobalCollapse} />
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
                      openModal={() => openModal(todo._id, todo.section)}
                    />
                  ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          {/* Repeat the above structure for other sections */}
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
        />
      </Modal>
    </>
  );
};

export default Cards;
