import dotenv from "dotenv"

dotenv.config()

const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    CORS_ORIGIN: process.env.CORS_ORIGIN
}

export default ENVIRONMENT
