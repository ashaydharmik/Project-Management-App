const express = require("express");
const { registerUser, loginUser, updatePassword, currentUser } = require("../Controller/userController");
const errorHandler = require("../Middleware/errorHandler");
const token = require("../Middleware/validateToken")
const {addTodo, fetchRecentTodo, getAllTodoCreated} = require("../Controller/todoController")


const router = express.Router();

router.post("/register", registerUser); //done

router.post("/login", loginUser); //done

router.put("/updatePassword",token, updatePassword); //done

router.get("/currentUser",token, currentUser); //done

router.post("/addTodo",token, addTodo); //done

router.get("/getSingleTodo/:_id",token, fetchRecentTodo); 

router.get("/getAllTodo",token, getAllTodoCreated); //done

router.use(errorHandler);

module.exports = router;
