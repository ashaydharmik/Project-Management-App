import React, { useState } from "react";
import "./cards.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreatedCard from "../CreatedCard/CreatedCard";
import Modal from "react-modal";
import TodoModal from "../../../Modal/TodoModal/TodoModal";
const Cards = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
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
                <VscCollapseAll />
              </p>
            </div>
            <div className="card">
             
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>To do</p>
              <p>
                <IoMdAdd onClick={openModal}/>
                <VscCollapseAll />
              </p>
            </div>
            <div className="card">
              <CreatedCard />
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>In progress</p>
              <p>
                <VscCollapseAll />
              </p>
            </div>
            <div className="card">
              
            </div>
          </div>
          <div className="card-box">
            <div className="card-title">
              <p>Done</p>
              <p>
                <VscCollapseAll />
              </p>
            </div>
            <div className="card">
             
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
        <TodoModal closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default Cards;
