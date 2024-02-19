import React from "react";
import "./auth.scss";
import image from "../../assets/avatar1.jpg";
import circle from "../../assets/circle1.png"
import Register from "../Authentication/Register/Register";
import Login from "./Login/Login";
import { useGlobal } from "../Context/Context";
const Auth = () => {
  console.log("Auth component rendered");
  const { showRegister } = useGlobal();

  return (
    <>
      <section className="authentication">
        <div className="left-container">
          <div className="content-container">
            <div className="image-container">
              <img src={circle} className="circle" alt="" />
              <img src={image} className="avatar" alt="" />
            </div>
            <div className="content">
              <p>Welcome aboard my friend</p>
              <p>just a couple of clicks and we start</p>
            </div>
          </div>
        </div>
        <div className="right-container">
          {showRegister ? <Register /> : <Login />}
        </div>
      </section>
    </>
  );
};

export default Auth;
