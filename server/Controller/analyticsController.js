const asyncHandler = require("../Middleware/asyncHandler");
const Todo = require("../Models/todoModel");


const highPriority = asyncHandler(async(req, res) => {

    const highPriorityCount = await Todo.countDocuments({ priority: 'high' });
    res.status(200).json({ highPriorityCount });
})


const moderatePriority = asyncHandler(async(req, res) => {

    const moderatePriorityCount = await Todo.countDocuments({ priority: 'moderate' });
    res.status(200).json({ moderatePriorityCount });
})


const lowPriority = asyncHandler(async(req, res) => {

    const lowPriorityCount = await Todo.countDocuments({ priority: 'low' });
    res.status(200).json({lowPriorityCount });
})


const backlogTodoTask = asyncHandler(async(req, res) => {

    const backlogTodoCount = await Todo.countDocuments({ section: 'backlog' });
    res.status(200).json({backlogTodoCount });
})

const progressTodoTask = asyncHandler(async(req, res) => {

    const progressTodoCount = await Todo.countDocuments({ section: 'progress' });
    res.status(200).json({progressTodoCount });
})

const currentTodoTask = asyncHandler(async(req, res) => {

    const currentTodoCount = await Todo.countDocuments({ section: 'todo' });
    res.status(200).json({currentTodoCount });
})

const completedTodoTask = asyncHandler(async(req, res) => {

    const completedTodoCount = await Todo.countDocuments({ section: 'done' });
    res.status(200).json({completedTodoCount });
})


const dueDateTodoTask = asyncHandler(async (req, res) => {
    // Find the count of todos in 'todo' section
    const todoCount = await Todo.countDocuments({ section: 'todo' });

    // Find the count of todos in 'backlog' section
    const backlogCount = await Todo.countDocuments({ section: 'backlog' });

    // Find the count of todos in 'progress' section
    const progressCount = await Todo.countDocuments({ section: 'progress' });

    // Calculate the total count
    const totalDueDateCount = todoCount + backlogCount + progressCount;

    res.status(200).json({ totalDueDateCount });
});


module.exports = { highPriority, moderatePriority, lowPriority, backlogTodoTask, progressTodoTask, currentTodoTask, completedTodoTask, dueDateTodoTask };


