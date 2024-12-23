const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

const authMiddleware = (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization
        if (!authorizationHeader) return next(ApiError.UnauthorizedError())
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) return next(ApiError.UnauthorizedError())
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) return next(ApiError.UnauthorizedError())
        request.user = userData
        next()
    }
    catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}

module.exports = authMiddleware