import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { checkTokenExpiry, verifyToken } from "../utils/utils.js";
import userModel from "../models/user.model.js";



const auth = asyncHandler(async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next(createError(422, "Token required."))
    }

    const isvalid = await verifyToken(accessToken);
    if (!isvalid) {
        return next(createError(422, "invalid token."))
    }

    const isExpire = checkTokenExpiry(isvalid.exp)
    if (isExpire) {
        return next(createError(401, "Token expired."))
    }
    
    const user = await userModel.findOne({ email: isvalid.email, accessToken })
    if (!user) {
        return next(createError(422, "Invalid user."))
    }

    req.user = user
    next()
})

export {auth}