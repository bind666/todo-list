import dotenv from "dotenv";

dotenv.config()

const config = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    JWT_REFRESH_TOKEN_SECRET:process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_SECRET:process.env.JWT_ACCESS_TOKEN_SECRET
}

export default config