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


module.exports = {highPriority, moderatePriority, lowPriority};
