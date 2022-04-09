import pool from "../config/db.js";

class UserService {

    async getOneUser(selector) {
        const sqlQuery = selector.type === 'id' ?
            `SELECT * FROM user WHERE id_user = ${selector.value}` :
            `SELECT * FROM user WHERE email = '${selector.value}'`;

        const result = await pool.query(sqlQuery);
        return result[0][0]
    }

    async getAllUsers() {
        const sqlQuery = `SELECT * FROM user`;
        const result = await pool.query(sqlQuery);
        return result[0]
    }
    //TODO
    async updateUser(userData) {}

}

export default new UserService();