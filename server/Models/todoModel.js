const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Please enter task name"],
    },
    priority: {
      type: String,
      enum: ["high", "moderate", "low"],
      required: [true, "Please enter your email"],
    },
    checklist: [
      {
        label: {
          type: String,
          required: [true, "Please enter checklist item label"],
        },
        done: {
          type: Boolean,
          default: false,
        },
      },
    ],
    dueDate: {
      type: Date,
      default: null,
    },
    section: {
      type: String,
      enum: ["backlog", "todo", "progress", "done"],
      default: "todo",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
