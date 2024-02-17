import React, { useState } from "react";
import "../Register/register.scss";
import { MdOutlineEmail } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import "./login.scss";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useGlobal } from "../../Context/Context";

const Login = () => {
  const initialValue = { email: "", password: "" };
  const [loginData, setLoginData] = useState(initialValue);
  const { navigate, setShowRegister } = useGlobal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        loginData
      );

      if (response.data && response.data.message) {
        toast.success(response.data.message);
        console.log("user logged-in");
        localStorage.setItem("user", JSON.stringify(response.data));
        setLoginData(initialValue);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.log("Error during Login:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during Login");
      }
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="heading">
          <h1>Login</h1>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="info">
              <p>
                {" "}
                <MdOutlineEmail />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                />
              </p>
              <p>
                {" "}
                <RiLock2Line />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                />
              </p>
            </div>
            <div className="btn-container">
              <button type="submit">Log in</button>
            </div>
          </form>
        </div>
        <div className="register-btn">
          <p>Have no account yet?</p>
          <button type="button" onClick={() => setShowRegister(true)}>
            Register
          </button>
        </div>
      </div>

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

export default Login;
