import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import logo from "../../assets/logo.png";
import "./livePage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";

const LivePage = () => {
  const [todoData, setTodoData] = useState([]);
  const { id } = useParams();

  const fetchLivePageData = () => {
    axios
      .get(`https://project-management-app-5swq.onrender.com/live-page/${id}`)
      .then((res) => {
        setTodoData(res.data.availableTodo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLivePageData();
  }, [id]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#63C05B";
      case "moderate":
        return "#18B0FF";
      case "high":
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <>
      <section className="livepage-container">
        <div className="heading">
          <img src={logo} alt="" width="30px" height="30px" />
          <h1>Pro Manage</h1>
        </div>
        <div className="todo-container">
          <div className="todo-box">
            <div className="priority-box">
              <p>
                <GoDotFill
                  style={{ color: getPriorityColor(todoData.priority) }}
                />
              </p>
              <p>{todoData.priority}</p>
            </div>
            <div className="todo-name">
              <p>{todoData.taskName}</p>
            </div>
            <div className="checklist-box">
              <p>
                Checklist (
                {
                  (todoData?.checklist?.filter((item) => item.done) || [])
                    .length
                }
                /{(todoData?.checklist || []).length})
              </p>
            </div>
            <div className="todo-lists">
              {(todoData.checklist || []).map((item, index) => (
                <label key={index}>
                  <input type="checkbox" checked={item.done} />
                  {item.label}
                </label>
              ))}
            </div>
            <div className="date-box">
              {todoData.dueDate && (
                <>
                  <p>Due Date</p>
                  <p id="dateBtn">
                    {new Date(todoData.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LivePage;
