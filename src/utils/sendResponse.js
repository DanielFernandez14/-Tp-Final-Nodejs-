export function sendResponse(response, status, message, data = null) {
    response.status(status).json({
        success: status < 400,
        message,
        data
    })
}
