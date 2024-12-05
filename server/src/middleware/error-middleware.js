const ApiError = require('../exceptions/api-error')

const errorMiddleware = (error, request, response, next) => {
    console.log('error', error)
    if (error instanceof ApiError) {
        return response
            .status(error.status)
            .json({message: error.message, errors: error.errors})
    }
    return response.status(500).json({message: 'Unknown error'})
}

module.exports = errorMiddleware