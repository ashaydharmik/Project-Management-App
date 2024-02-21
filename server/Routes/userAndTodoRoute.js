const express = require("express");
const { registerUser, loginUser, updatePassword, currentUser } = require("../Controller/userController");
const errorHandler = require("../Middleware/errorHandler");
const token = require("../Middleware/validateToken")
const {addTodo, fetchRecentTodo, getAllTodoCreated, updateTodo} = require("../Controller/todoController")


const router = express.Router();

router.post("/register", registerUser); //done

router.post("/login", loginUser); //done

router.put("/updatePassword",token, updatePassword); 

router.get("/currentUser",token, currentUser); 

router.post("/addTodo",token, addTodo); 

router.get("/getSingleTodo/:_id",token, fetchRecentTodo); 

router.get("/getAllTodo",token, getAllTodoCreated); 

router.put("/updateTodo/:_id",token, updateTodo); 

router.use(errorHandler);

module.exports = router;
