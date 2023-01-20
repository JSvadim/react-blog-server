//third-party
import jwt from "jsonwebtoken";

// local imports
import pool from "../config/db.js";

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: 60 * 10});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: "10d"});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const sqlQueryGetToken = `SELECT * FROM token WHERE id_user = ?`;
        const sqlQueryAddToken = `INSERT INTO token(id_user, refresh_token) 
            VALUES (?, ?)`;
        const sqlQueryUpdateToken = `UPDATE token
            SET refresh_token = ?
            WHERE id_user = ?`;
        const tokenData = await pool.query(sqlQueryGetToken, userId);
        if(tokenData[0][0]) {
            await pool.query(sqlQueryUpdateToken, [refreshToken, userId])
            return 
        }
        await pool.query(sqlQueryAddToken, [userId, refreshToken])
        const token = await pool.query(sqlQueryGetToken, userId);
        return token[0][0]
    }

    async removeToken(refreshToken) {
        const sqlQuery = `DELETE FROM token WHERE refresh_token = ?`
        await pool.query(sqlQuery, refreshToken);
    }

    async getTokenData(refreshToken) {
        const sqlQuery = `SELECT * FROM token WHERE refresh_token = ?`;
        const token = await pool.query(sqlQuery, refreshToken);
        return token[0][0]
    }

    validateAccessToken(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
            return payload
        } catch(e) {
            return null
        }
    }
    validateRefreshToken(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
            return payload
        } catch(e) {
            return null
        }
    }
}

export default new TokenService();