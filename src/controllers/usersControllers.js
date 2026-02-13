import bcrypt from "bcrypt"
import ServerError from "../helper/serverError.js"
import User from "../models/userModel.js"
import { buscarPorEmail, createUser, updateUserById } from "../repository/userRepository.js"
import { sendResponse } from "../utils/sendResponse.js"

export async function createUserController(request, response, next) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            throw new ServerError("Email y password son requeridos", 400)
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        if (!normalizedEmail) {
            throw new ServerError("Email inválido", 400)
        }

        const user_found = await buscarPorEmail(normalizedEmail)
        if (user_found) {
            throw new ServerError("El usuario ya existe", 400)
        }

        const password_crypted = await bcrypt.hash(String(password), 10)
        const user = await createUser(normalizedEmail, password_crypted)

        sendResponse(response, 201, "Usuario creado exitosamente", {
            id: user._id,
            email: user.email,
            created_at: user.created_at
        })
    } catch (error) {
        next(error)
    }
}

export async function listUsersController(_request, response, next) {
    try {
        const users = await User.find().select("_id email created_at").sort({ created_at: -1 })
        sendResponse(response, 200, "Usuarios obtenidos", { users })
    } catch (error) {
        next(error)
    }
}

export async function deleteUserController(request, response, next) {
    try {
        const { id } = request.params
        const normalizedId = String(id).trim()

        const deleted = await User.findByIdAndDelete(normalizedId)
        if (!deleted) {
            throw new ServerError("Usuario no encontrado", 404)
        }

        sendResponse(response, 200, "Usuario eliminado", {
            id: deleted._id,
            email: deleted.email
        })
    } catch (error) {
        next(error)
    }
}

export async function updateUserController(request, response, next) {
    try {
        const { id } = request.params
        const normalizedId = String(id).trim()
        const { email, password } = request.body

        const update = {}

        if (email !== undefined) {
            const normalizedEmail = String(email).trim().toLowerCase()
            if (!normalizedEmail) {
                throw new ServerError("Email inválido", 400)
            }

            const existing = await buscarPorEmail(normalizedEmail)
            if (existing && String(existing._id) !== String(normalizedId)) {
                throw new ServerError("El email ya está en uso", 400)
            }

            update.email = normalizedEmail
        }

        if (password !== undefined) {
            const pass = String(password)
            if (!pass.trim()) {
                throw new ServerError("Password inválido", 400)
            }

            update.password = await bcrypt.hash(pass, 10)
        }

        if (Object.keys(update).length === 0) {
            throw new ServerError("No hay datos para actualizar", 400)
        }

        const updated = await updateUserById(normalizedId, update)
        if (!updated) {
            throw new ServerError("Usuario no encontrado", 404)
        }

        sendResponse(response, 200, "Usuario actualizado", {
            id: updated._id,
            email: updated.email,
            created_at: updated.created_at
        })
    } catch (error) {
        next(error)
    }
}
