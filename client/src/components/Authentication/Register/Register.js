import React, { useState } from "react";
import "./register.scss";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useGlobal } from "../../Context/Context";
import Login from "../Login/Login";

const Register = () => {
  const initialValue = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [registerData, setRegisterData] = useState(initialValue);
  const { setShowRegister } = useGlobal();
  const [showLogin, setShowLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://project-management-app-5swq.onrender.com/register",
        registerData
      );

      if (response.data && response.data.message) {
        toast.success(response.data.message);
        localStorage.setItem("user", JSON.stringify(response.data));
        setRegisterData(initialValue);
        setShowLogin(true);
      }
    } catch (error) {
      console.log("Error during registration:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during registration");
      }
    }
  };

  return (
    <>
      {showLogin ? (
        <Login />
      ) : (
        <div className="register-container">
          <div className="heading">
            <h1>Register</h1>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="info">
                <p>
                  <FaRegUser />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={registerData.name}
                    onChange={handleChange}
                  />
                </p>
                <p>
                  <MdOutlineEmail />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                  />
                </p>
                <p>
                  <RiLock2Line />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                  />
                </p>
                <p>
                  <RiLock2Line />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
                  />
                </p>
              </div>
              <div className="btn-container">
                <button type="submit">Register</button>
              </div>
            </form>
          </div>
          <div className="login-btn">
            <p>Have an account ?</p>
            <button type="button" onClick={() => setShowRegister(false)}>
              Log in
            </button>
          </div>
        </div>
      )}
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

export default Register;
