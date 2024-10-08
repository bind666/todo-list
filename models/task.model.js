import { Schema, model } from "mongoose";
import userModel from "./user.model.js";

const taskSchema = new Schema({
    creatorID: {
        type: Schema.Types.ObjectId,
        ref: "userModel"
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "userModel",
        default: null
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    dueDate: {   
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'in progress'],
        default: 'pending',
        required: true
    },
}, {
    timestamps: true
});

const taskModel = model("todoModel", taskSchema)
export default taskModel