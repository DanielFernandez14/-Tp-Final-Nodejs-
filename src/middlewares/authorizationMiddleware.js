import ENVIRONMENT from "../config/environment.js"
import jwt from "jsonwebtoken"
import ServerError from "../helper/serverError.js"

function authorizationMiddleware(request, _response, next) {
    try {
        const authorization_header = request.headers.authorization

        if (!authorization_header) {
            throw new ServerError("No hay token de autenticación", 401)
        }

        const auth_token = authorization_header.split(" ")[1]
        if (!auth_token) {
            throw new ServerError("No hay token", 401)
        }

        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        request.user = payload

        next()
    } catch (error) {
        next(error)
    }
}

export default authorizationMiddleware
