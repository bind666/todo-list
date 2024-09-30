import express from "express";
import { validateLoginUser, validateRegisterUser } from "../middleware/validator.js";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.route("/register").post(validateRegisterUser,registerUser)
userRouter.route("/login").post(validateLoginUser,loginUser)
userRouter.route("/logout").delete(auth,logoutUser)


export{userRouter};