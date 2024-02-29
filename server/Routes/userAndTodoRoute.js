const express = require("express");

const {
  registerUser,
  loginUser,
  updatePassword,
  currentUser,
} = require("../Controller/userController");

const errorHandler = require("../Middleware/errorHandler");
const token = require("../Middleware/validateToken");

const {
  addTodo,
  fetchRecentTodo,
  getAllTodoCreated,
  updateTodo,
  deleteTodo,
  moveToSection,
} = require("../Controller/todoController");

const {
  highPriority,
  moderatePriority,
  lowPriority,
  backlogTodoTask,
  progressTodoTask,
  currentTodoTask,
  completedTodoTask,
  dueDateTodoTask,
} = require("../Controller/analyticsController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/updatePassword", token, updatePassword);

router.get("/currentUser", token, currentUser);

router.post("/addTodo", token, addTodo);

router.get("/live-page/:_id", fetchRecentTodo);

router.get("/getAllTodo", token, getAllTodoCreated);

router.put("/updateTodo/:_id", token, updateTodo);

router.delete("/deleteTodo/:_id", token, deleteTodo);

//priority routes
router.get("/highPriority", token, highPriority);
router.get("/moderatePriority", token, moderatePriority);
router.get("/lowPriority", token, lowPriority);

//task routes
router.get("/backlogTodoTask", token, backlogTodoTask);
router.get("/progressTodoTask", token, progressTodoTask);
router.get("/currentTodoTask", token, currentTodoTask);
router.get("/completedTodoTask", token, completedTodoTask);
router.get("/dueDateTodoTask", token, dueDateTodoTask);

//moving todo from one section to other
router.put("/moveToSection/:_id", token, moveToSection);

router.use(errorHandler);

module.exports = router;
