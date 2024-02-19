import React from 'react'
import { GoDotFill } from "react-icons/go";
import logo from "../../assets/logo.png";
import "./livePage.scss"
const LivePage = () => {
  return (
    <>
    <section className='livepage-container'>
    <div className="heading">
          <img src={logo} alt="" width="30px" height="30px" />
          <h1>Pro Manage</h1>
        </div>
        <div className='todo-container'>
            <div className='todo-box'>
                <div className='priority-box'>
                <p><GoDotFill />Backlog Tasks</p>
                </div>
                <div className='todo-name'>
                    <p>Hero Sction</p>
                </div>
                <div className='checklist-box'>
                    <p>Checklist (0/3)</p>
                </div>
                <div className='todo-lists'>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                   
                </div>
                <div className='date-box'>
                    <p>Due Date</p>
                    <p>Feb 10th</p>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default LivePage