import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { assignTask, createTask, deleteTask, fetchTask, fetchTasksWithFilters, TaskSummary, updateTask } from "../controller/task.controller.js";
import { validateFetchRequest } from "../middleware/validator.js";

const taskRouter = express.Router();

taskRouter.route("/").post(auth, createTask)
taskRouter.route("/").get(validateFetchRequest, auth, fetchTask)
taskRouter.route("/search").get(auth, fetchTasksWithFilters)
taskRouter.route("/:id").put(auth, updateTask)
taskRouter.route("/:id").delete(auth, deleteTask)

taskRouter.route("/assign").patch(auth, isAdmin, assignTask)
taskRouter.route("/report").get(auth, TaskSummary)


export { taskRouter };