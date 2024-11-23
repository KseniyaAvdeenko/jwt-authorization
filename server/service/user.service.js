const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const uuid = require('uuid')
const mailService = require('./mail.service')
const tokenService = require('./token.service')
const UserDto = require('../dto/user.dto')
const ApiError = require('../exceptions/apiError')

class UserService {
    async signup(email, password) {
        const candidate = await User.findOne({email: email});
        if (candidate) {
            throw ApiError.BadRequestError(`User with email ${email} already exists`, [])
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationUrl = uuid.v4()
        const user = await User.create({
            email: email,
            password: hashPassword,
            activationLink: activationUrl
        });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activation/` + activationUrl);
        const userDto = new UserDto(user)
        return {user: userDto}
    }

    async activateMail(link) {
        const user = await User.findOne({activationLink: link});
        if (!user) {
            throw ApiError.BadRequestError('Incorrect link', [])
        }
        user.isActivated = true;
        await user.save()
    }

    async signin(email, password) {
        const user = await User.findOne({email: email});
        if (!user) {
            throw ApiError.BadRequestError(`User does not exist`, [])
        }
        const isPassEqual = await bcrypt.compare(password, user.password)
        if (!isPassEqual) {
            throw ApiError.BadRequestError(`Incorrect password`, [])
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async signOut(refresh) {
        await tokenService.deleteToken(refresh)
    }

    async refresh(refresh) {
        if (!refresh) throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refresh);
        const tokenFromDb = await tokenService.getToken(refresh);
        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await User.find()
        return users
    }
}


module.exports = new UserService;