const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token.model')


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: 15 * 60
        })

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '15d'
        })
        return {accessToken, refreshToken}
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const token = await TokenModel.findOne({user: userId});
        if (token) {
            token.refresh = refreshToken;
            return await token.save()
        } else {
            return await TokenModel.create({user: userId, refresh: refreshToken})
        }
    }

    async getToken(refresh) {
        const token = await TokenModel.findOne({refresh: refresh});
        return token
    }

    async deleteToken(refresh) {
        const tokenData = await TokenModel.deleteOne({refresh: refresh})
        return tokenData;
    }
}

module
    .exports = new TokenService;