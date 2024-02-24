import React, { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa6";
import { RiLock2Line } from "react-icons/ri";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./settings.scss"
import { useGlobal } from '../../Context/Context';
const SettingsPage = () => {
  const initialValue = {password: "", newPassword:"" };
  const [userData, setUserData] = useState(initialValue);
const [username, setUsername] = useState("")
const [token, setToken] = useState(null);
const auth = JSON.parse(localStorage.getItem("user"))

useEffect(()=>{
  const userToken = auth.token;
  setToken(userToken)
  console.log(userToken)
},[])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };



  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (token) {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          };
          console.log('Headers:', headers);
          const response = await axios.get("http://localhost:4000/currentUser", { headers });
          console.log('Response:', response.data);
          setUsername(response.data.userName)
        } else {
          console.log('Token is missing');
        }
      } catch (error) {
        console.log('Error:', error);
      } 
    };

    fetchCurrentUser();
  }, [token]);
   
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedUserData = {
        ...userData,
        name: username, // Include the username in the request payload
      };
  
      const response = await axios.put(
        "http://localhost:4000/updatePassword",
        updatedUserData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        console.log("User password updated");
        console.log(response.data.message);
       setUserData(initialValue)
      }
    } catch (error) {
      console.log("Error during password update:", error);
  
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during password update");
      }
    }
  };
  
  return (

    <>
    <section className='settings-container'>
      <div className='heading'>
        <h1>Settings</h1>
      </div>
      <div className='setting-form-container'>
      <form onSubmit={handleSubmit}>
      <div className="info">
              <p>
                {" "}
                <FaRegUser />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={username}
                  readOnly 
                />
              </p>
              <p>
                {" "}
                <RiLock2Line />
                <input
                  type="password"
                  placeholder="Old Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
              </p>
              <p>
                {" "}
                <RiLock2Line />
                <input
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                />
              </p>
            </div>
            <div className="btn-container">
              <button type="submit">Update</button>
            </div>
          </form>
      </div>
    </section>
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
  )
}

export default SettingsPage