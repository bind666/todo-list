import userModel from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler"
import taskModel from "../models/task.model.js";

const createTask = asyncHandler(async (req, res, next) => {
    const { _id: creatorID } = req.user;

    const { title, description, priority, status } = req.body

    if (!title) {
        return next(createError(422, "Title required."))
    }

    if (!priority) {
        return next(createError(422, "Title required."))
    }

    const validPriority = ['low', 'medium', 'high']

    if (!validPriority.includes(priority)) {
        return next(createError(422, "Invalid type."))
    }


    const task = await taskModel.create({
        creatorID,
        title,
        description,
        priority,
        status
    })

    res.status(200).json(new ApiResponse(task, "Task created."))
})

const fetchTask = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const { id } = req.user
    const skip = (page - 1) * limit;

    const tasks = await taskModel.find({ creatorID: id }).skip(skip).limit(limit).sort(sort).
        select("-createdAt -__v -updatedAt -creatorID ")

    // console.log(tasks);
    if (tasks.length === 0) {
        return next(createError(404, "No task avilable"))
    }

    res.status(200).json(new ApiResponse(tasks, "tasks fetched"))
})

const deleteTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(createError(422, "Id required"))
    }

    const task = await taskModel.findOne({ _id: id, creatorID: req.user._id })

    if (!task) {
        return next(createError(404, "Invalid task"))
    }

    await task.deleteOne()
    res.status(200).json(new ApiResponse(null, "task deleted successfully"))
})

const updateTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { priority, status } = req.body

    if (!id) {
        return next(createError(422, "Id required."))
    }

    const task = await taskModel.findOneAndUpdate({ _id: id, creatorID: req.user._id }, { priority, status }, { new: true, runValidators: true })

    if (!task) {
        return next(createError(404, "Invalid task."))
    }

    res.status(200).json(new ApiResponse(task, "task updated."))
})




export { createTask, deleteTask, updateTask, fetchTask }