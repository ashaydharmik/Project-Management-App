import React from 'react'
import "./board.scss"
import Cards from './Cards/Cards'
const BoardPage = () => {
  return (
    <>
    <section className='board-container'>
      <div className='board-heading'>
        <p>Welcome! <span>Kumar</span></p>
        <p>12th Jan, 2024</p>
      </div>

      <Cards/>
      
    </section>
    </>
  )
}

export default BoardPage