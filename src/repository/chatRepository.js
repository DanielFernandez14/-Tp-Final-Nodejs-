import Chat from "../models/chatModel.js"

export async function createChat(userIdA, userIdB) {
    const [user_id_1, user_id_2] =
        String(userIdA) < String(userIdB) ? [userIdA, userIdB] : [userIdB, userIdA]

    const chat = await Chat.create({ user_id_1, user_id_2 })
    return chat
}

export async function findChatBetween(userIdA, userIdB) {
    const [user_id_1, user_id_2] =
        String(userIdA) < String(userIdB) ? [userIdA, userIdB] : [userIdB, userIdA]

    const chat = await Chat.findOne({ user_id_1, user_id_2 })
    return chat
}

export async function findChatsByUserId(userId) {
    const chats = await Chat.find({
        $or: [{ user_id_1: userId }, { user_id_2: userId }]
    })
        .populate("user_id_1", "email")
        .populate("user_id_2", "email")
        .sort({ created_at: -1 })

    return chats
}

export async function findChatById(chatId) {
    const chat = await Chat.findById(chatId)
        .populate("user_id_1", "email")
        .populate("user_id_2", "email")

    return chat
}

export async function deleteChatById(chatId) {
    const deleted = await Chat.findByIdAndDelete(chatId)
    return deleted
}
