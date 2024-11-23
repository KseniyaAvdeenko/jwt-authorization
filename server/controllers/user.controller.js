const userService = require('../service/user.service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')

class UserController {
    async signUp(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) return next(ApiError.BadRequestError('Validation error', errors.array()))
            const {email, password} = req.body;
            const userData = await userService.signup(email, password)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async signIn(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await userService.signin(email, password)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 15 * 86400000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async signOut(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.signOut(refreshToken)
            res.clearCookie('refreshToken');
            return res.json('Deleted successfully')
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activateMail(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const user = await userService.refresh(refreshToken)
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 15 * 86400000,
                httpOnly: true,
            })
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()