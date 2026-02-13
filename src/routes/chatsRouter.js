import express from "express"
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js"
import { createChatController, deleteChatController, getChatByIdController, listChatsController } from "../controllers/chatsController.js"
import { createMessageByChatController, deleteMessageController, listMessagesByChatController, updateMessageByChatController } from "../controllers/messagesController.js"

const chatsRouter = express.Router()

chatsRouter.use(authorizationMiddleware)

chatsRouter.get("/", listChatsController)
chatsRouter.get("/:chat_id", getChatByIdController)
chatsRouter.post("/", createChatController)
chatsRouter.delete("/:chat_id", deleteChatController)

chatsRouter.get("/:chat_id/messages", listMessagesByChatController)
chatsRouter.post("/:chat_id/messages", createMessageByChatController)
chatsRouter.patch("/:chat_id/messages/:message_id", updateMessageByChatController)
chatsRouter.delete("/:chat_id/messages/:message_id", deleteMessageController)

export default chatsRouter
