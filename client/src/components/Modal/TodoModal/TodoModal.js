import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { ImBin2 } from "react-icons/im";
import "./todoModal.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const initialChecklistItem = { label: "", done: false };

const TodoModal = ({ closeModal, singleTodo, updateTodo, selectedTodoId }) => {
  const initialValue = {
    taskName: "",
    priority: "",
    checklist: [initialChecklistItem],
    dueDate: "",
  };
  const [todoData, setTodoData] = useState(initialValue);
  const [dueDate, setDueDate] = useState(null);
  const auth = JSON.parse(localStorage.getItem("user"));

  

  useEffect(() => {
    if (singleTodo) {
      const newDueDate = singleTodo.dueDate ? new Date(singleTodo.dueDate) : null;
  
      setTodoData((prevTodoData) => ({
        ...prevTodoData,
        taskName: singleTodo.taskName || "",
        priority: singleTodo.priority || "",
        checklist: singleTodo.checklist || [initialChecklistItem],
        dueDate: newDueDate,
      }));
  
      // Update the dueDate state directly
      setDueDate(newDueDate);
    } else {
      // Handle the case when creating a new todo
      setTodoData({
        ...initialValue,
        checklist: [], // Set checklist to an empty array for new todos
      });
  
      setDueDate(null);
    }
  }, [singleTodo, initialChecklistItem]);
  

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({
      ...todoData,
      [name]: value,
    });
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
  };

  // TodoModal.js

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todoData.checklist.some((item) => item.label.trim() !== "")) {
      toast.error("Please add at least one todo task");
      return;
    }

    // Display an error message or handle the validation as needed
    if (!todoData.priority) {
      toast.error("Please select a priority");
      return;
    }

    // Add dueDate to todoData
    const dataWithDueDate = {
      ...todoData,
      dueDate: dueDate,
    };

    try {
      const userToken = auth.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };

      if (selectedTodoId) {
        // Update existing todo
        const response = await axios.put(
          `http://localhost:4000/updateTodo/${selectedTodoId}`,
          dataWithDueDate,
          { headers }
        );

        if (response.status === 200) {
          console.log("Todo task successfully updated:", response.data);
          toast.success("Todo task successfully updated");

          // Call the updateTodo function in Cards.js with the updated data
          updateTodo(response.data.updatedTodo);
        } else {
          console.error("Error updating todo task:", response.data.message);
          toast.error("Error updating todo task");
        }
      } else {
        // Create new todo
        const response = await axios.post(
          "http://localhost:4000/addTodo",
          dataWithDueDate,
          { headers }
        );

        if (response.status === 200) {
          console.log("Todo task successfully created:", response.data);
          toast.success("Todo task successfully created");
        } else {
          console.error("Error creating todo task:", response.data.message);
          toast.error("Error creating todo task");
        }
      }

      // Close the modal after submitting
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
                      required
                    />
                    <ImBin2 onClick={() => handleDelete(index)} />
                  </label>
                </div>
              ))}
            </div>
            <div className="task-add-button">
              <button type="button" onClick={handleAddNew}>
                <IoMdAdd />
                Add New{" "}
              </button>
            </div>
            <div className="task-date-save-buttons">
              <div className="due-date-button">
                <DatePicker
                  className="datepicker"
                  dateFormat="MM/dd/yyyy"
                  selected={dueDate}
                  onChange={handleDueDateChange}
                  placeholderText="Select Due Date"
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
