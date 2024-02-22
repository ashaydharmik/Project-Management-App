import React, { useEffect, useState } from "react";
import "./cards.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreatedCard from "../CreatedCard/CreatedCard";
import Modal from "react-modal";
import TodoModal from "../../../Modal/TodoModal/TodoModal";
import { useParams } from "react-router-dom";
import axios from "axios";
const Cards = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const auth = JSON.parse(localStorage.getItem("user"));
  const [singleTodo, setSingleTodo] = useState(null);
  const [isGlobalCollapse, setGlobalCollapse] = useState(false);
 

  const openModal = (todoId) => {
    setSingleTodo(null);
    setSelectedTodoId(todoId); // Set the selected todo ID first
    console.log("id", todoId);
    setModalOpen(true);
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
        `http://localhost:4000/getSingleTodo/${selectedTodoId}`,
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
    if (selectedTodoId) {
      console.log("Todo ID found:", selectedTodoId);
      getSingleTodoData();
    } else {
      console.log("No Todo ID found");
    }
  }, [selectedTodoId]);

  const handleGlobalCollapse = () => {
    setGlobalCollapse(!isGlobalCollapse);
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
            <div className="card"></div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>To do</p>
              <p>
                <IoMdAdd onClick={() => openModal(null)} />
                <VscCollapseAll onClick={handleGlobalCollapse} />
              </p>
            </div>
            <div className="card">
              <CreatedCard
                openModal={openModal}
                globalCollapse={isGlobalCollapse}
               
                singleTodo={singleTodo}
              />
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>In progress</p>
              <p>
                <VscCollapseAll onClick={handleGlobalCollapse} />
              </p>
            </div>
            <div className="card"></div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>Done</p>
              <p>
                <VscCollapseAll onClick={handleGlobalCollapse} />
              </p>
            </div>
            <div className="card"></div>
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
