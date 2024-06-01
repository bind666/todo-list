import express from "express"
import dbConnect from "./db/dbConnect.js"
import errorHandler from "./middleware/errorHandler.js"
import { userRouter } from "./routes/user.routes.js";
import config from "./config/config.js"
import cookieParser from "cookie-parser";
import { taskRouter } from "./routes/task.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


//routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/task",taskRouter)


app.use(errorHandler)

dbConnect().then(() => {
    const PORT = config.PORT
    app.listen(PORT,() => {
        console.log(`app is listening at port`, PORT);
    })
}).catch((error) => {
    console.log(`mongodb error!!`, error);
    process.exit(1)
})
