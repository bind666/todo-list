import bcrypt, { hash } from "bcrypt";
import createError from "http-errors";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()

    } catch (error) {
        return next(createError(500, error.message))
    }
}, {
    timestamps: true
})

const userModel = model("userModel", userSchema);

export default userModel