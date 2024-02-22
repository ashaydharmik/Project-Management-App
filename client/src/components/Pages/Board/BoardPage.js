import React, { useEffect } from 'react'
import "./board.scss"
import Cards from './Cards/Cards'
const BoardPage = () => {
  const auth = JSON.parse(localStorage.getItem("user"))
const username = auth.userName;
  
  return (

    <>
    <section className='board-container'>
      <div className='board-heading'>
        <p>Welcome! <span>{username}</span></p>
        <p>12th Jan, 2024</p>
      </div>

      <Cards/>
      
    </section>
    </>
  )
}

export default BoardPage