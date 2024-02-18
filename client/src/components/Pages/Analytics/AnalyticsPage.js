import React from 'react'
import "./analytics.scss"
import { GoDotFill } from "react-icons/go";
const AnalyticsPage = () => {
  return (
    <>
    <section className='analytics-container'>
      <div className='heading'>
        <h1>Analytics</h1>
      </div>
      <div className='analytics-box'>
      <div className='task-container'>
       <div className='tasks'>
        <p>
          <p><GoDotFill />Backlog Tasks</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />To-do Tasks</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />In-Progress Tasks</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />Completed Tasks</p>
          <span>16</span>
        </p>
        
       </div>
      </div>
      <div className='priority-container'>
      <div className='priority'>
        <p>
          <p><GoDotFill />Low Priority</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />Moderate Priority</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />High Priority</p>
          <span>16</span>
        </p>
        <p>
          <p><GoDotFill />Due Date Tasks</p>
          <span>16</span>
        </p>
        
       </div>
      </div>

      </div>
    </section>
    </>
  )
}

export default AnalyticsPage