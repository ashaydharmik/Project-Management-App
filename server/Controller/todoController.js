const asyncHandler = require("../Middleware/asyncHandler");
const Todo = require("../Models/todoModel");
const { format } = require("date-fns");
const User = require("../Models/userModel")
//create todo task
const addTodo = asyncHandler(async(req, res) => {
  const { taskName, priority, checklist, dueDate, section } = req.body;

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
    section,
    taskName,
    priority,
    checklist,
    dueDate: dueDate || null,
    user: user._id,
  });

  console.log(newTodo)

  if (newTodo) {
    const formattedDueDate = newTodo.dueDate ? format(newTodo.dueDate, "MM/dd/yyyy") : null;
    res.status(200).json({
      message: "Todo task successfully created",
      _id: newTodo.id,
      taskName: newTodo.taskName,
      checklist: newTodo.checklist,
      dueDate: formattedDueDate,
      section: newTodo.section,
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
    try {
    // Ensure that the user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { selectedOption } = req.query;

    // Fetch todos based on the selectedOption
    let todos;

    switch (selectedOption) {
      case 'today':
        todos = await Todo.find({
          user: req.user._id,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        });
        break;

      case 'week':
        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - 6); // 6 days ago
        todos = await Todo.find({
          user: req.user._id,
          createdAt: { $gte: weekStartDate },
        });
        break;

      case 'month':
        const monthStartDate = new Date();
        monthStartDate.setMonth(monthStartDate.getMonth() - 1); // 1 month ago
        todos = await Todo.find({
          user: req.user._id,
          createdAt: { $gte: monthStartDate },
        });
        break;

      default:
        res.status(400).json({ message: 'Invalid selected option' });
        return;
    }

    res.status(200).json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//update todo task
const updateTodo = asyncHandler(async(req,res)=>{
  const { taskName, priority, checklist, dueDate, section } = req.body; // Make sure to include 'section' in the destructuring
  const { _id } = req.params;
     
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const availableTodo = await Todo.findOne({ _id });
  if(!availableTodo){
    res.status(404).json({ message: "Todo not exists" });
    return;
  }

  const updatedTodo = await Todo.findByIdAndUpdate(_id, {
    taskName, priority, checklist, dueDate, section
  }, { new: true });

  if(updatedTodo){
    res.status(200).json({ message: "Product Updated Successfully", updatedTodo });
  } else {
    res.status(400).json({ message: "Invalid Data" });
  }
});


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


//move to different sections
const moveToSection=asyncHandler(async(req,res)=>{
    const { _id } = req.params;
    const { section } = req.body;

    try {
        const todo = await Todo.findById({_id});

        if (!todo) {
            res.status(404);
            throw new Error('Todo not found');
        }

        todo.section = section;
        const updatedTodo = await todo.save();

        res.status(200).json({ success: true, data: updatedTodo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


//filtering the select option today, week and month
// const selectTodos = asyncHandler(async (req, res) => {
//   try {
//     // Ensure that the user is authenticated
//     if (!req.user) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const { selectedOption } = req.query;

//     // Fetch todos based on the selectedOption
//     let todos;

//     switch (selectedOption) {
//       case 'today':
//         todos = await Todo.find({
//           user: req.user._id,
//           createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
//         });
//         break;

//       case 'week':
//         const weekStartDate = new Date();
//         weekStartDate.setDate(weekStartDate.getDate() - 6); // 6 days ago
//         todos = await Todo.find({
//           user: req.user._id,
//           createdAt: { $gte: weekStartDate },
//         });
//         break;

//       case 'month':
//         const monthStartDate = new Date();
//         monthStartDate.setMonth(monthStartDate.getMonth() - 1); // 1 month ago
//         todos = await Todo.find({
//           user: req.user._id,
//           createdAt: { $gte: monthStartDate },
//         });
//         break;

//       default:
//         res.status(400).json({ message: 'Invalid selected option' });
//         return;
//     }

//     res.status(200).json({ todos });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


module.exports = {addTodo, fetchRecentTodo, getAllTodoCreated, updateTodo , deleteTodo, moveToSection};