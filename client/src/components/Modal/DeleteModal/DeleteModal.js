import React from "react";
import Modal from "react-modal";
import "./deleteModal.scss";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const DeleteModal = ({ isOpen, onClose, todoId, fetchData }) => {
  const auth = JSON.parse(localStorage.getItem("user"));
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
      width: "30%",
      height: "35%",
      borderRadius: "10px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const handleDelete = () => {
    const userToken = auth.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    axios
      .delete(
        `https://project-management-app-5swq.onrender.com/deleteTodo/${todoId}`,
        { headers }
      )
      .then((response) => {
        onClose();
        fetchData();
        toast.success("Todo successfully Deleted");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Delete Todo Modal"
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <div className="delete-modal-container">
          <p>Are you sure you want to Delete?</p>
          <button onClick={handleDelete} id="delete-todo">
            Yes, Delete
          </button>
          <button onClick={onClose} id="cancel-todo">
            Cancel
          </button>
        </div>
      </Modal>
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            width: "350px",
            fontSize: "18px",
          },
        }}
      />
    </>
  );
};

export default DeleteModal;
