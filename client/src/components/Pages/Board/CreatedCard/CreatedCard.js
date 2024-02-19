import React from 'react'
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown  } from "react-icons/io";
const CreatedCard = () => {
  return (
    <>
    <div className='created-card-heading'>
        <p><GoDotFill />HIGH PRIORITY</p>
        <p><HiDotsHorizontal /></p>
    </div>
    <div className='created-card-title'>
        <p>Hero section</p>
    </div>
    <div className='created-card-checklist'>
    <p>Checklist (0/3)</p>
    <p><IoIosArrowUp /></p>
    </div>
    <div className='created-card-lists'>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                    <label><input type='checkbox'/>Done Task</label>
                   
                </div>
                <div className='created-card-buttons'>
                    <button>Feb 10th</button>
                    <button>PROGRESS</button>
                    <button>TO-DO</button>
                    <button>DONE</button>
                </div>
    </>
  )
}

export default CreatedCard