import React, { useEffect, useState } from 'react';
import "./board.scss";
import Cards from './Cards/Cards';
import axios from 'axios';

const BoardPage = () => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const username = auth.userName;
  const token = auth.token;
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        if (token) {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };

          const response = await axios.get("https://project-management-app-5swq.onrender.com/currentUser", { headers });
          // console.log('Response:', response.data);
          const apiDate = response.data.lastLoginDate;

          // Convert the string date to a Date object
          const dateObject = new Date(apiDate);

        // Get day, month, and year separately
        const day = dateObject.getDate();
        const month = dateObject.toLocaleString('default', { month: 'short' });
        const year = dateObject.getFullYear();

        // Assemble the formatted date
        const formattedDate = `${day} ${month}, ${year}`;

          setDate(formattedDate);
        } else {
          console.log('Token is missing');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchCurrentDate();
  }, [token]);

  return (
    <>
      <section className='board-container'>
        <div className='board-heading'>
          <p>Welcome! <span>{username}</span></p>
          <p id='date'>{date}</p>
        </div>
        <Cards />
      </section>
    </>
  );
};

export default BoardPage;
