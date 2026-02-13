import bcrypt from "bcrypt"
import ServerError from "../helper/serverError.js"
import { buscarPorEmail, createUser } from "../repository/userRepository.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.js"
import { sendResponse } from "../utils/sendResponse.js"

export async function register(request, response, next) {
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

export async function login(request, response, next) {
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
        if (!user_found) {
            throw new ServerError("El usuario no existe", 404)
        }

        const isSamePassword = await bcrypt.compare(String(password), user_found.password)
        if (!isSamePassword) {
            throw new ServerError("Contraseña incorrecta", 401)
        }

        const auth_token = jwt.sign(
            {
                email: user_found.email,
                id: user_found._id,
                created_at: user_found.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        )

        sendResponse(response, 200, "Login exitoso", {
            token: auth_token
        })
    } catch (error) {
        next(error)
    }
}
