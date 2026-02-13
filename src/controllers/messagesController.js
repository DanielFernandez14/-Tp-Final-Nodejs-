import ServerError from "../helper/serverError.js"
import { sendResponse } from "../utils/sendResponse.js"
import { findChatById } from "../repository/chatRepository.js"
import { createMessage, deleteMessageById, findMessageById, findMessagesByChatId, updateMessageById } from "../repository/messageRepository.js"

function ensureParticipant(chat, userId) {
    return (
        String(chat.user_id_1) === String(userId) ||
        String(chat.user_id_2) === String(userId) ||
        String(chat.user_id_1?._id) === String(userId) ||
        String(chat.user_id_2?._id) === String(userId)
    )
}

export async function listMessagesByChatController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()

        const limit = Number(request.query.limit || 50)
        const page = Number(request.query.page || 1)
        const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 200 ? limit : 50
        const safePage = Number.isFinite(page) && page > 0 ? page : 1
        const skip = (safePage - 1) * safeLimit

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado para ver mensajes de este chat", 403)
        }

        const messages = await findMessagesByChatId(chat_id, safeLimit, skip)
        sendResponse(response, 200, "Mensajes obtenidos", {
            chat_id,
            page: safePage,
            limit: safeLimit,
            messages
        })
    } catch (error) {
        next(error)
    }
}

export async function createMessageByChatController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()
        const { content } = request.body

        const normalizedContent = String(content || "").trim()
        if (!normalizedContent) {
            throw new ServerError("content es requerido", 400)
        }

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado para enviar mensajes a este chat", 403)
        }

        const message = await createMessage(chat_id, userId, normalizedContent)

        sendResponse(response, 201, "Mensaje enviado", { message })
    } catch (error) {
        next(error)
    }
}

export async function updateMessageByChatController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()
        const message_id = String(request.params.message_id || "").trim()
        const { content } = request.body

        const normalizedContent = String(content || "").trim()
        if (!normalizedContent) {
            throw new ServerError("content es requerido", 400)
        }

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado", 403)
        }

        const message = await findMessageById(message_id)
        if (!message) {
            throw new ServerError("Mensaje no encontrado", 404)
        }

        if (String(message.chat_id) !== String(chat_id)) {
            throw new ServerError("El mensaje no pertenece a este chat", 400)
        }

        if (String(message.sender_user_id) !== String(userId)) {
            throw new ServerError("Solo el autor puede editar su mensaje", 403)
        }

        const updated = await updateMessageById(message_id, { content: normalizedContent })
        sendResponse(response, 200, "Mensaje actualizado", { message: updated })
    } catch (error) {
        next(error)
    }
}

export async function deleteMessageController(request, response, next) {
    try {
        const userId = String(request.user.id).trim()
        const chat_id = String(request.params.chat_id || "").trim()
        const message_id = String(request.params.message_id || "").trim()

        const chat = await findChatById(chat_id)
        if (!chat) {
            throw new ServerError("Chat no encontrado", 404)
        }

        if (!ensureParticipant(chat, userId)) {
            throw new ServerError("No autorizado", 403)
        }

        const message = await findMessageById(message_id)
        if (!message) {
            throw new ServerError("Mensaje no encontrado", 404)
        }

        if (String(message.chat_id) !== String(chat_id)) {
            throw new ServerError("El mensaje no pertenece a este chat", 400)
        }

        if (String(message.sender_user_id) !== String(userId)) {
            throw new ServerError("Solo el autor puede borrar su mensaje", 403)
        }

        await deleteMessageById(message_id)

        sendResponse(response, 200, "Mensaje eliminado", { message_id })
    } catch (error) {
        next(error)
    }
}