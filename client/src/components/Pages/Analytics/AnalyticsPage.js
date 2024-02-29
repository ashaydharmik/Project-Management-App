import React, { useEffect, useState } from "react";
import "./analytics.scss";
import { GoDotFill } from "react-icons/go";

import { useGlobal } from "../../Context/Context";

const AnalyticsPage = () => {
  const {
    highPriority,
    fetchHighPriority,
    fetchModeratePriority,
    moderatePriority,
    fetchLowPriority,
    lowPriority,
    backlogTodo,
    fetchBacklogTodoTask,
    currentTodo,
    fetchCurrentTodoTask,
    progressTodo,
    fetchProgressTodoTask,
    doneTodo,
    fetchCompletedTodoTask,
    dueDate,
    fetchDueDateTodoTask,
  } = useGlobal();

  useEffect(() => {
    fetchHighPriority();
    fetchModeratePriority();
    fetchLowPriority();
    fetchBacklogTodoTask();
    fetchCurrentTodoTask();
    fetchProgressTodoTask();
    fetchCompletedTodoTask();
    fetchDueDateTodoTask();
  }, []);

  return (
    <>
      <section className="analytics-container">
        <div className="heading">
          <h1>Analytics</h1>
        </div>
        <div className="analytics-box">
          <div className="task-container">
            <div className="tasks">
              <p>
                <p>
                  <GoDotFill />
                  Backlog Tasks
                </p>
                <span>{backlogTodo.backlogTodoCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  To-do Tasks
                </p>
                <span>{currentTodo.currentTodoCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  In-Progress Tasks
                </p>
                <span>{progressTodo.progressTodoCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  Completed Tasks
                </p>
                <span>{doneTodo.completedTodoCount}</span>
              </p>
            </div>
          </div>
          <div className="priority-container">
            <div className="priority">
              <p>
                <p>
                  <GoDotFill />
                  Low Priority
                </p>
                <span>{lowPriority.lowPriorityCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  Moderate Priority
                </p>
                <span>{moderatePriority.moderatePriorityCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  High Priority
                </p>
                <span>{highPriority.highPriorityCount}</span>
              </p>
              <p>
                <p>
                  <GoDotFill />
                  Due Date Tasks
                </p>
                <span>{dueDate.totalDueDateCount}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnalyticsPage;
