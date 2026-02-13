import { sendResponse } from "../utils/sendResponse.js"

export function errorHandler(error, _request, response, _next) {
    if (error?.name === "CastError") {
        sendResponse(response, 400, "ID inválido", null)
        return
    }

    if (error?.code === 11000) {
        sendResponse(response, 409, "Dato duplicado", null)
        return
    }

    const status = error?.status || 500
    const message = error?.message || "Error interno del servidor"
    sendResponse(response, status, message, null)
}
