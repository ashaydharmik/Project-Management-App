import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { ImBin2 } from "react-icons/im";
import "./todoModal.scss";

import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const initialChecklistItem = { label: "", done: false };

const TodoModal = ({
  closeModal,
  singleTodo,
  updateTodo,
  selectedTodoId,
  section,
  fetchData,
}) => {
  const initialValue = {
    taskName: "",
    priority: "",
    checklist: [initialChecklistItem],
    dueDate: null,
  };
  const [todoData, setTodoData] = useState(initialValue);
  const auth = JSON.parse(localStorage.getItem("user"));
  const [addTodoErrMsg, setAddTodoErrMsg] = useState(false);
  const [selectPriorityErrMsg, setSelectPriorityErrMsg] = useState(false);

  useEffect(() => {
    if (singleTodo) {
      const formattedDueDate = singleTodo.dueDate
        ? formatDate(singleTodo.dueDate, "MM/DD/YYYY", true)
        : null;
      setTodoData((prevData) => ({
        ...prevData,
        taskName: singleTodo.taskName || "",
        priority: singleTodo.priority || "",
        checklist: singleTodo.checklist || [initialChecklistItem],
        dueDate: formattedDueDate,
      }));
    } else {
      setTodoData({
        ...initialValue,
        checklist: [],
      });
    }
  }, [singleTodo, initialChecklistItem]);

  const formatDate = (date, format = "DD-MM-YYYY", isPrefilling = false) => {
    if (format === "DD-MM-YYYY") {
      return new Date(date)
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("-")
        .join("/");
    } else if (format === "MM/DD/YYYY") {
      return new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } else if (format === "MM/DD/YYYY" && isPrefilling) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }
    return date;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dueDate") {
      const parsedDate = new Date(value);
      const formattedDate = parsedDate.toISOString().split("T")[0];

      setTodoData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    } else {
      setTodoData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    if (name === "dueDate" && type === "text") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      e.target.value = formattedDate;
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedChecklist = [...todoData.checklist];
    updatedChecklist[index].done = !updatedChecklist[index].done;
    setTodoData({
      ...todoData,
      checklist: updatedChecklist,
    });
  };

  const handleAddNew = () => {
    const newChecklistItem = { label: "", done: false };
    setTodoData({
      ...todoData,
      checklist: [...todoData.checklist, newChecklistItem],
    });
    setAddTodoErrMsg(false);
  };

  const handleDelete = (index) => {
    const updatedChecklist = [...todoData.checklist];
    updatedChecklist.splice(index, 1);
    setTodoData({
      ...todoData,
      checklist: updatedChecklist,
    });
  };

  const handleChangeChecklistItem = (e, index) => {
    const { value } = e.target;
    const updatedChecklist = [...todoData.checklist];
    updatedChecklist[index].label = value;
    setTodoData({
      ...todoData,
      checklist: updatedChecklist,
    });
  };

  const handlePriorityClick = (value) => {
    setTodoData({
      ...todoData,
      priority: value,
    });
    setSelectPriorityErrMsg(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todoData.checklist.some((item) => item.label.trim() !== "")) {
      setAddTodoErrMsg(true);
      return;
    }

    if (!todoData.priority) {
      setSelectPriorityErrMsg(true);
      return;
    }

    const dataWithDueDateAndSection = {
      ...todoData,
      section: section,
    };

    const userId = JSON.parse(localStorage.getItem("user")).id;
    dataWithDueDateAndSection.userId = userId;

    try {
      const userToken = auth.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };

      if (selectedTodoId) {
        const response = await axios.put(
          `https://project-management-app-5swq.onrender.com/updateTodo/${selectedTodoId}`,
          dataWithDueDateAndSection,
          { headers }
        );

        if (response.status === 200) {
          toast.success("Todo task successfully updated");
          updateTodo(response.data.updatedTodo);
        } else {
          console.error("Error updating todo task:", response.data.message);
          toast.error("Error updating todo task");
        }
        fetchData();
      } else {
        const response = await axios.post(
          "https://project-management-app-5swq.onrender.com/addTodo",
          dataWithDueDateAndSection,
          { headers }
        );

        if (response.status === 200) {
          toast.success("Todo task successfully created");
          updateTodo(response.data.createdTodo);

          fetchData();
        } else {
          console.error("Error creating todo task:", response.data.message);
          toast.error("Error creating todo task");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error updating/creating todo task");
    }
  };

  return (
    <>
      <section className="todoModal-container">
        <div className="todo-form-container">
          <form onSubmit={handleSubmit}>
            <div className="task-title">
              <label>
                Title <span>*</span>
              </label>
              <input
                type="text"
                required
                name="taskName"
                onChange={handleChange}
                value={todoData.taskName}
                placeholder="Enter Task Title"
              />
            </div>

            <div className="task-priority">
              <label>
                Select Priority <span>*</span>
              </label>

              <button
                type="button"
                style={{
                  backgroundColor:
                    todoData.priority === "high" ? "#EEECEC" : "transparent",
                }}
                onClick={() => handlePriorityClick("high")}
              >
                <GoDotFill />
                HIGH PRIORITY
              </button>
              <button
                type="button"
                style={{
                  backgroundColor:
                    todoData.priority === "moderate"
                      ? "#EEECEC"
                      : "transparent",
                }}
                onClick={() => handlePriorityClick("moderate")}
              >
                <GoDotFill />
                MODERATE PRIORITY
              </button>
              <button
                type="button"
                style={{
                  backgroundColor:
                    todoData.priority === "low" ? "#EEECEC" : "transparent",
                }}
                onClick={() => handlePriorityClick("low")}
              >
                <GoDotFill />
                LOW PRIORITY
              </button>
            </div>
            {selectPriorityErrMsg && (
              <p className="errMsg">Please select a priority</p>
            )}

            <div className="checklist">
              <p>
                Checklist (
                {todoData.checklist.filter((item) => item.done).length}/
                {todoData.checklist.length}) <span>*</span>
              </p>
            </div>

            <div className="task-lists">
              {todoData.checklist.map((item, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleChangeChecklistItem(e, index)}
                      placeholder="Add a task"
                      required
                    />
                    <ImBin2 onClick={() => handleDelete(index)} />
                  </label>
                </div>
              ))}
            </div>
            <div className="task-add-button">
              {addTodoErrMsg && (
                <p className="errMsg">Please add at least one todo task</p>
              )}

              <button type="button" onClick={handleAddNew}>
                <IoMdAdd />
                Add New
              </button>
            </div>
            <div className="task-date-save-buttons">
              <div className="due-date-button">
                <input
                  type="text"
                  className="datepicker"
                  value={todoData.dueDate || ""}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={handleBlur}
                  name="dueDate"
                  placeholder="Select Due Date"
                />
              </div>

              <div className="submit-button">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
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
  );
};

export default TodoModal;
