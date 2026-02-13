import Message from "../models/messageModel.js"

export async function createMessage(chat_id, sender_user_id, content) {
    const message = await Message.create({ chat_id, sender_user_id, content })
    return message
}

export async function findMessagesByChatId(chat_id, limit = 50, skip = 0) {
    const messages = await Message.find({ chat_id })
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(limit)
        .populate("sender_user_id", "email")

    return messages
}

export async function findMessageById(message_id) {
    const message = await Message.findById(message_id)
    return message
}

export async function updateMessageById(message_id, update) {
    const updated = await Message.findByIdAndUpdate(message_id, update, {
        new: true,
        runValidators: true
    }).populate("sender_user_id", "email")

    return updated
}

export async function deleteMessageById(message_id) {
    const deleted = await Message.findByIdAndDelete(message_id)
    return deleted
}

export async function deleteMessagesByChatId(chat_id) {
    const result = await Message.deleteMany({ chat_id })
    return result
}
