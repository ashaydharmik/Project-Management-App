import React from 'react'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import "./logoutModal.scss"
const LogoutModal = ({ isOpen, onClose  }) => {
    const navigate = useNavigate()
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

      const auth = JSON.parse(localStorage.getItem("user")) || {};
const token = auth.token
      const handleLogout = () => {
        if (auth && auth.token) {
          localStorage.clear();
          navigate("/");
        }
      };

      
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logout Modal"
      style={customStyles}
      shouldCloseOnOverlayClick={false}
    >
      <div className='logout-modal-container'> 
        <p>Are you sure you want to Logout?</p>
        <button onClick={()=> handleLogout(token)} id='logout-btn'>Yes, Logout</button>
        <button onClick={onClose} id='cancel-btn'>Cancel</button>
      </div>
    </Modal>
  );
};

export default LogoutModal;