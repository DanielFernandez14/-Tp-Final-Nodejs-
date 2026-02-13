import User from "../models/userModel.js"

export async function createUser(email, password) {
    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await User.create({ email: normalizedEmail, password })
    return user
}

export async function buscarUserPorId(user_id) {
    const user = await User.findById(user_id)
    return user
}

export async function buscarPorEmail(email) {
    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    return user
}

export async function updateUserById(user_id, update) {
    const user = await User.findByIdAndUpdate(user_id, update, {
        new: true,
        runValidators: true
    })
    return user
}
