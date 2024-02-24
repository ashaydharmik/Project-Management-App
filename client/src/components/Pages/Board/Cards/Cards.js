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
  const [allTodoData, setAllTodoData] = useState([]);

  // const [backlogCards, setBacklogCards] = useState([]);
  // const [progressCards, setProgressCards] = useState([]);
  // const [doneCards, setDoneCards] = useState([]);

  const openModal = (todoId) => {
    console.log("Before setting todo ID:", todoId);

    // Set the selected todo ID and log the updated value in the callback
    setSelectedTodoId((prevTodoId) => {
      console.log("After setting todo ID:", prevTodoId);

      // Check if todoId is null or undefined
      if (todoId !== null && todoId !== undefined) {
        // If it's an existing todo task, fetch and set the singleTodo data
        getSingleTodoData();
        console.log("Fetching singleTodo data...");
      } else {
        // If it's a new todo task, set singleTodo to null
        console.log("Setting singleTodo to null");
        setSingleTodo(null);
      }

      // Even though `setSelectedTodoId` is asynchronous, the modal state will be set immediately
      setModalOpen(true);

      // Return the updated value to be stored in the state
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
      // console.log(selectedTodoId)
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
    // Check if selectedTodoId is not null
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
          // Handle the response or update local state as needed
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
        const todoArray = Object.values(response.data.todo);
        console.log(response.data);
        setTodos(todoArray);
        // setAllTodo(todoArray);
        // Initialize isListCollapsed with false for each todo item
        // setListCollapsed(Array(todoArray.length).fill(false));
      } catch (error) {
        console.error("Error fetching todo data:", error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (selectedTodoId) {
  //     console.log("Todo ID found:", selectedTodoId);
  //     getSingleTodoData();
  //   } else {
  //     console.log("No Todo ID found");
  //   }
  // }, [selectedTodoId]);

  const handleGlobalCollapse = () => {
    setGlobalCollapse(!isGlobalCollapse);
  };

  const moveCard = async (todoId,  targetColumn) => {
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    try {
      await axios.put(`http://localhost:4000/updateTodo/${todoId}`,
      { section: targetColumn }, // Wrap the data in an object
      { headers }
      );
      console.log(todoId);
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
              {todos
                .filter((todo) => todo.section === "backlog")
                .map((todo) => (
                  <CreatedCard key={todo._id} todo={todo} onMove={moveCard} />
                ))}
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
              {todos
                .filter((todo) => todo.section === "todo")
                .map((todo) => (
                  <CreatedCard
                    key={todo._id}
                    todo={todo}
                    onMove={moveCard}
                    openModal={openModal}
                    globalCollapse={isGlobalCollapse}
                  />
                ))}
             
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>In progress</p>
              <p>
                <VscCollapseAll onClick={handleGlobalCollapse} />
              </p>
            </div>
            <div className="card progress-section">
              {todos
                .filter((todo) => todo.section === "progress")
                .map((todo) => (
                  <CreatedCard key={todo._id} todo={todo} onMove={moveCard} />
                ))}
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>Done</p>
              <p>
                <VscCollapseAll onClick={handleGlobalCollapse} />
              </p>
            </div>
            <div className="card done-section">
              {todos
                .filter((todo) => todo.section === "done")
                .map((todo) => (
                  <CreatedCard key={todo._id} todo={todo} onMove={moveCard} />
                ))}
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
        />
      </Modal>
    </>
  );
};

export default Cards;
