const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const EmailService = require('../services/email-service')
const tokenService = require('../services/token-service')
const UserDto = require('../dto/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password) {
        /** Проверяем нет ли с таким email пользователя в db если есть бросем ошибку */
        const candidate = await UserModel.findOne({email})
        if (candidate) throw ApiError.BadRequestError(`Пользователь с такой почтой уже существует: ${email}`)

        /** Хешируется пароль и создается ссылка для активации аккаунта */
        const hashedPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()

        /** Создаем пользователя в базе данных и отправляем ссылку для активации аккаунта на почту */
        const user = await UserModel.create({email, password: hashedPassword, activationLink})
        const emailService = new EmailService()
        await emailService.sendActivationEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        return { user: userDto}
    }

    async activate(activationLink) {
        /** Ищем пользователя по ссылке если он есть то меняем isActivated = true и сохраняем его */
        const user = await UserModel.findOne({activationLink})
        if (!user) throw new Error('Не корректная ссылка активации')
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        /** Проверяем нет ли с таким email пользователя в db если нету бросем ошибку */
        const user = await UserModel.findOne({email})
        if (!user) throw ApiError.BadRequestError('Пользователь с такой почтой не найден')

        /** Проверка пароля */
        const isPassEqual = await bcrypt.compare(password, user.password)
        if (!isPassEqual) throw ApiError.BadRequestError('Неверный пароль')

        /** создаем UserDto генерируем токены и сохраняем refresh токен в db*/
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        /** Выход из аккаунта и удаление токенов */
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        /** бросем ошибку UnauthorizedError если нету refreshToken, userData и tokenFromDB */
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

        /** создаем UserDto генерируем токены и сохраняем refresh токен в db*/
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        return (await UserModel.find())
    }
}

module.exports = new UserService()