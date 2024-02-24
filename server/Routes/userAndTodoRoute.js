const express = require("express");
const { registerUser, loginUser, updatePassword, currentUser } = require("../Controller/userController");
const errorHandler = require("../Middleware/errorHandler");
const token = require("../Middleware/validateToken")
const {addTodo, fetchRecentTodo, getAllTodoCreated, updateTodo, deleteTodo, moveToSection} = require("../Controller/todoController")
const {highPriority, moderatePriority, lowPriority, backlogTodoTask, progressTodoTask, currentTodoTask, completedTodoTask} = require("../Controller/analyticsController")

const router = express.Router();

router.post("/register", registerUser); //done

router.post("/login", loginUser); //done

router.put("/updatePassword",token, updatePassword); //done

router.get("/currentUser",token, currentUser); //done

router.post("/addTodo",token, addTodo); //done

router.get("/live-page/:_id", fetchRecentTodo); 

router.get("/getAllTodo",token, getAllTodoCreated); //done

router.put("/updateTodo/:_id",token, updateTodo); //done

router.delete("/deleteTodo/:_id",token, deleteTodo); //done


//priority routes
router.get("/highPriority", token, highPriority) //done
router.get("/moderatePriority", token, moderatePriority) //done
router.get("/lowPriority", token, lowPriority) //done

//task routes
router.get("/backlogTodoTask", token, backlogTodoTask)
router.get("/progressTodoTask", token, progressTodoTask)
router.get("/currentTodoTask", token, currentTodoTask)
router.get("/completedTodoTask", token, completedTodoTask)

//update to different todo task route
router.put("/updateSection/:todoId",token, moveToSection);  //done

router.use(errorHandler);

module.exports = router;
