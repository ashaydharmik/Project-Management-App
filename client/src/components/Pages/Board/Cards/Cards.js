import React from "react";
import "./cards.scss"
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreatedCard from "../CreatedCard/CreatedCard";
const Cards = () => {
  return (
    <>
    <div className="cards-container">
      <div className="board-title-filter-container">
        <h1>Board</h1>
        <p>
          <select id="dropdown" name="dropdown">
            <option value="option1">Today</option>
            <option value="option2">This Week</option>
            <option value="option3">This Month</option>
          </select>
        </p>
      </div>
        <div className="cards-box-container">
            <div className="card-box">
                <div className="card-title">
                    <p>Backlog</p>
                    <p><VscCollapseAll /></p>
                </div>
                <div className="card">
<CreatedCard/>
                </div>
            </div>
            <div className="card-box">
                <div className="card-title">
                    <p>To do</p>
                    <p><IoMdAdd /><VscCollapseAll /></p>
                </div>
                <div className="card">
                <CreatedCard/>
                </div>
            </div>
            <div className="card-box">
                <div className="card-title">
                    <p>In progress</p>
                    <p><VscCollapseAll /></p>
                </div>
                <div className="card">
                <CreatedCard/>
                </div>
            </div>
            <div className="card-box">
                <div className="card-title">
                    <p>Done</p>
                    <p><VscCollapseAll /></p>
                </div>
                <div className="card">
                <CreatedCard/>
                </div>
            </div>
            
        </div>

    </div>
    </>
  );
};

export default Cards;
