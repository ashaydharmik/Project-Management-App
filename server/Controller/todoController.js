const asyncHandler = require("../Middleware/asyncHandler");
const Todo = require("../Models/todoModel");
const { format } = require("date-fns");
const User = require("../Models/userModel")
//create todo task
const addTodo = asyncHandler(async(req, res) => {
  const { taskName, priority, checklist, dueDate } = req.body;

  // Ensure that the user is authenticated (check your authentication middleware)
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!taskName || !priority || !checklist) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  // Additional date validation (you can use your preferred library for this)
  if (isNaN(new Date(dueDate))) {
    res.status(400).json({ message: "Invalid due date format" });
    return;
  }

  const user = await User.findOne({ email: req.user.email }); // Adjust this based on your user schema

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const availableTodo = await Todo.findOne({ taskName, user: user._id });
  
  if (availableTodo) {
    res.status(400).json({ message: "Task name already exists!!" });
    return;
  }

  const newTodo = await Todo.create({
    taskName,
    priority,
    checklist,
    dueDate: dueDate || null,
    user: user._id,
  });

  if (newTodo) {
    const formattedDueDate = newTodo.dueDate ? format(newTodo.dueDate, "MM/dd/yyyy") : null;
    res.status(200).json({
      message: "Todo task successfully created",
      _id: newTodo.id,
      taskName: newTodo.taskName,
      checklist: newTodo.checklist,
      dueDate: formattedDueDate,
      user: user._id,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});



//fetch single todo task created 
const fetchRecentTodo =asyncHandler(async(req,res)=>{
  const {_id} = req.params;
  const availableTodo = await Todo.findOne({ _id})
      if(!availableTodo){
          res.status(404)
          throw new Error("Todo not exists")
      }else{
          res.status(200).json({message:"Todo Found ", availableTodo})
      }
})

//fetch all todo task created for the authenticated user
const getAllTodoCreated = asyncHandler(async (req, res) => {
  // Ensure that the user is authenticated
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Fetch todos associated with the authenticated user
  const getTodo = await Todo.find({ user: req.user._id });

  if (getTodo.length > 0) {
    res.status(200).json({ todo: getTodo });
  } else {
    res.status(400).json({ message: 'No Todo Found for the authenticated user' });
  }
});


//update todo task
const updateTodo = asyncHandler(async(req,res)=>{
  const { taskName, priority, checklist, dueDate} = req.body
      const {_id} = req.params;
     
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const availableTodo = await Todo.findOne({ _id})
      if(!availableTodo){
          res.status(404)
          throw new Error("Todo not exists")
      }

  const updatedTodo = await Todo.findByIdAndUpdate(_id,{
    taskName, priority, checklist, dueDate
  },
  {new:true}
  )
  if(updatedTodo){
      res.status(200).json({message:"Product Updated Successfully", updatedTodo: updatedTodo})
  }else{
      res.status(400)
      throw new Error("Invalid Data")
  }
  
})

//delete Todo 
const deleteTodo=asyncHandler(async(req,res)=>{
  const { _id, taskName } = req.params;

  if (!_id) {
    res
      .status(400)
      .json({ error: "Invalid request. Missing created Todo ID." });
    return;
  }

  const deletedTodo = await Todo.findByIdAndDelete(_id);

  if (!deletedTodo) {
    res.status(404).json({ error: "Created Todo not found." });
  } else {
    res.status(200).json({ message: "Todo Successfully Deleted!!", taskName: deletedTodo.taskName });
  }


})



module.exports = {addTodo, fetchRecentTodo, getAllTodoCreated, updateTodo , deleteTodo};