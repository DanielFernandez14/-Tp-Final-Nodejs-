import ServerError from "../helper/serverError.js"
import { sendResponse } from "../utils/sendResponse.js"
import { buscarPorEmail } from "../repository/userRepository.js"
import { createChat, deleteChatById, findChatBetween, findChatById, findChatsByUserId } from "../repository/chatRepository.js"
import { deleteMessagesByChatId } from "../repository/messageRepository.js"

function ensureParticipant(chat, userId) {
    return (
        String(chat.user_id_1?._id) === String(userId) ||
        String(chat.user_id_2?._id) === String(userId) ||
        String(chat.user_id_1) === String(userId) ||
        String(chat.user_id_2) === String(userId)
    )
}

export async function listChatsController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chats = await findChatsByUserId(userId)

        const normalized = chats.map((chat) => {
            const isUser1 = String(chat.user_id_1?._id) === String(userId)
            const me = isUser1 ? chat.user_id_1 : chat.user_id_2
            const other = isUser1 ? chat.user_id_2 : chat.user_id_1

            return {
                _id: chat._id,
                created_at: chat.created_at,
                me: me ? { _id: me._id, email: me.email } : null,
                contact: other ? { _id: other._id, email: other.email } : null
            }
        })

        sendResponse(response, 200, "Chats obtenidos", { chats: normalized })
    } catch (error) {
        next(error)
    }
}

export async function getChatByIdController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado para ver este chat", 403)
        }

        sendResponse(response, 200, "Chat obtenido", {
            chat: {
                _id: chat._id,
                user_id_1: chat.user_id_1,
                user_id_2: chat.user_id_2,
                created_at: chat.created_at
            }
        })
    } catch (error) {
        next(error)
    }
}

export async function createChatController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const { contactEmail } = request.body

        const normalizedContactEmail = String(contactEmail || "").trim().toLowerCase()
        if (!normalizedContactEmail) {
            throw new ServerError("contactEmail es requerido", 400)
        }

        const contactUser = await buscarPorEmail(normalizedContactEmail)
        if (!contactUser) {
            throw new ServerError("El usuario/contacto no existe", 404)
        }

        if (String(contactUser._id) === String(userId)) {
            throw new ServerError("No podés crear un chat con vos mismo", 400)
        }

        const existing = await findChatBetween(userId, contactUser._id)
        if (existing) {
            sendResponse(response, 200, "Chat ya existente", { chat_id: existing._id })
            return
        }

        const chat = await createChat(userId, contactUser._id)

        sendResponse(response, 201, "Chat creado", { chat_id: chat._id })
    } catch (error) {
        next(error)
    }
}

export async function deleteChatController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado", 403)
        }

        const deleteMessagesResult = await deleteMessagesByChatId(chat_id)
        const deletedChat = await deleteChatById(chat_id)

        sendResponse(response, 200, "Chat eliminado", {
            chat_id: deletedChat?._id,
            messages_deleted: deleteMessagesResult?.deletedCount || 0
        })
    } catch (error) {
        next(error)
    }
}
