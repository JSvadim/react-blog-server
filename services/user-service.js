import pool from "../config/db.js";

class UserService {

    async getOneUser(selector) {
        const sqlQuery = `
        SELECT 
	        user.id_user as id,
            user.email,
            user.password,
            user.nickname,
            user_role.name as role,
            user_data.gender,
            user_data.birth_date,
            user_data.about,
            user_data.link_insta,
            user_data.link_vk,
            user_data.link_facebook,
            user_data.link_youtube
            FROM user 
            	LEFT JOIN user_role
               	ON user.id_role = user_role.id_role
                LEFT JOIN user_data
                ON user.id_user = user_data.id_user
                	WHERE user.${selector.type} = '${selector.value}'
        `;
        const result = await pool.query(sqlQuery);
        return result[0][0]
    }

    async getAllUsers() {
        const sqlQuery = `
        SELECT 
	        user.id_user as id,
            user.email,
            user.password,
            user.nickname,
            user_role.name as role,
            user_data.gender,
            user_data.birth_date,
            user_data.about,
            user_data.link_insta,
            user_data.link_vk,
            user_data.link_facebook,
            user_data.link_youtube
            FROM user 
            	LEFT JOIN user_role
               	ON user.id_role = user_role.id_role
                LEFT JOIN user_data
                ON user.id_user = user_data.id_user
        `;
        const result = await pool.query(sqlQuery);
        return result[0]
    }
    
    async updateUser(userData) {}

}

export default new UserService();