import connectDB from "./config/connectionDB.js"
import express from "express"
import cors from "cors"
import ENVIRONMENT from "./config/environment.js"
import { authRouter } from "./routes/authRouter.js"
import usersRouter from "./routes/usersRouter.js"
import chatsRouter from "./routes/chatsRouter.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { sendResponse } from "./utils/sendResponse.js"

connectDB()

const app = express()

app.use(express.json())

app.use(
    cors({
        origin: ENVIRONMENT.CORS_ORIGIN,
        credentials: true
    })
)

app.get("/health", (_request, response) => {
    sendResponse(response, 200, "OK", { status: "up" })
})

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/chats", chatsRouter)

app.use(errorHandler)

app.listen(ENVIRONMENT.PORT, () => {
    console.log(`✅ Servidor escuchando en el puerto ${ENVIRONMENT.PORT}`)
})