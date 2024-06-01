import mongoose from "mongoose";
import config from "../config/config.js"

async function dbConnect() {

    try {
        mongoose.connection.on("connected", () => {
            console.log(`mongodb connected successfully`, mongoose.connection.host);
        })

        mongoose.connection.on("disconnect", () => {
            console.log(`mongodb disconnected`, mongoose.connection.host);
        })

        mongoose.connection.on("error", () => {
            console.log(`database connection error`, mongoose.connection.host);
        })

        await mongoose.connect(config.DB_URI)

    } catch (error) {
        console.log(`mongodb connection error`, error);
        process.exit(1)
    }
}

export default dbConnect;