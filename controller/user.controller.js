import userModel from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt";
import { generateCookies } from "../utils/utils.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const isUser = await userModel.findOne({ email: req.body.email })
    // console.log(req.body.email);
    if (isUser) {
        return next(createError(422, "user already exists"))
    }

    const user = await userModel.create(req.body)
    res.status(200).json(new ApiResponse(user, "user registered sucessfully"))
})

const loginUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return next(createError(404, "Invalid credintials"))
    }

    const isPassword = await bcrypt.compare(req.body.password, user.password) //comparing a hashed password
    if (!isPassword) {
        return next(createError(401, "Invalid credintials"))
    }

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const { refreshToken, accessToken } = generateCookies(payload)
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save()
    // user.password = null

    res.status(200)
        .cookie("refreshToken", refreshToken, { httpOnly: true, expiresIn: "24h" })
        .cookie("accessToken", accessToken, { httpOnly: true, expiresIn: "8h" })
        .json(new ApiResponse({ user, refreshToken, accessToken }, "user registered sucessfully"))
})
const logoutUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user
    await userModel.findByIdAndUpdate(_id, {
        refreshToken: null,
        accessToken: null
    })

    res.status(200)
        .cookie("refreshToken", null, { httpOnly: true, expiresIn: new Date() })
        .cookie("accessToken", null, { httpOnly: true, expiresIn: new Date() })
        .json(new ApiResponse(null, "logout successfully"))
})

export { registerUser, loginUser, logoutUser }