import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    user_id_1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user_id_2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

chatSchema.index({ user_id_1: 1, user_id_2: 1 }, { unique: true })

const Chat = mongoose.model("Chat", chatSchema)

export default Chat
