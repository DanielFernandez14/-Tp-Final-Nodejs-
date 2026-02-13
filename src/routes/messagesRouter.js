import express from "express"
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js"
import { createMessageController, deleteMessageDirectController, listMessagesController, updateMessageController } from "../controllers/messagesController.js"

const messagesRouter = express.Router()

messagesRouter.use(authorizationMiddleware)

messagesRouter.get("/", listMessagesController)
messagesRouter.post("/", createMessageController)
messagesRouter.patch("/:message_id", updateMessageController)
messagesRouter.delete("/:message_id", deleteMessageDirectController)

export default messagesRouter
