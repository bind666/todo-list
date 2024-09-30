import userModel from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler"
import taskModel from "../models/task.model.js";

const createTask = asyncHandler(async (req, res, next) => {
    const { _id: creatorID } = req.user;

    const { title, description, priority, status, dueDate } = req.body

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
        status,
        dueDate
    })

    res.status(200).json(new ApiResponse(task, "Task created."))
})

const fetchTask = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const { id } = req.user
    const skip = (page - 1) * limit;

    const tasks = await taskModel.find({ $or: [{ creatorID: id }, { assignedUser: id }] }).skip(skip).limit(limit).sort(sort).
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

const fetchTasksWithFilters = asyncHandler(async (req, res, next) => {
    const { page, limit, sort, status, priority, assignedUser, } = req.query;
    const { id } = req.user;
    const skip = (page - 1) * limit;

    const query = {
        creatorID: id
    }

    if (status) {
        query.status = status;
    }
    if (priority) {
        query.priority = priority;
    }
    if (assignedUser) {
        query.assignedUser = assignedUser;
    }

    const tasks = await taskModel.find(query).skip(skip).limit(limit).sort(sort)
        .select("-__v -updatedAt");

    if (tasks.length === 0) {
        return next(createError(404, "No tasks found with the given criteria."));
    }

    const totalTasks = await taskModel.countDocuments(query);

    res.status(200).json(new ApiResponse({
        tasks,
        totalTasks,
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit)
    }, "Tasks fetched successfully"));
})

const assignTask = asyncHandler(async (req, res, next) => {
    const { taskId, userId } = req.body;

    const task = await taskModel.findById(taskId);
    if (!task) {
        return next(createError(401, "Task not found."))
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return next(createError(401, "User not found."))
    }

    task.assignedUser = userId;
    await task.save();

    res.status(200).json({ message: "Task assigned successfully", task });
})

const TaskSummary = asyncHandler(async (req, res, next) => {
    const { status, assignedUser, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (assignedUser) query.assignedUser = assignedUser;
    if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const tasks = await taskModel.find(query)
        .populate("assignedUser", "username email")
        .populate("creatorID", "username email");

    res.status(200).json({
        success: true,
        message: "Task summary report generated successfully.",
        data: tasks
    });
});


export { createTask, deleteTask, updateTask, fetchTask, assignTask, TaskSummary, fetchTasksWithFilters }