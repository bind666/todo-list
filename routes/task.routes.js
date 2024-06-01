import express from "express";
import { auth } from "../middleware/auth.js";
import { createTask, deleteTask, fetchTask, updateTask } from "../controller/task.controller.js";
import { validateFetchRequest } from "../middleware/validator.js";

const taskRouter = express.Router();

taskRouter.route("/").post(auth, createTask)
taskRouter.route("/").get(validateFetchRequest, auth, fetchTask)
taskRouter.route("/:id").put(auth, updateTask)
taskRouter.route("/:id").delete(auth, deleteTask)


export { taskRouter };