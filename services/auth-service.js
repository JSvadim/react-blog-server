// local imports
import pool from "../config/db.js";
import userService from "./user-service.js";

class AuthService {
    async signIn(data) {
        console.log(data)
        const sqlQuery = `
            START TRANSACTION; 

                INSERT INTO user( email, password, nickname) 
                    VALUES (?, ?, @userName := ?); 
                    
                SELECT @userId := id_user FROM user WHERE nickname = @userName; 

                INSERT INTO user_data (id_user, gender) VALUES (@userId, ?); 
                
            COMMIT; 
        `
        await pool.query(sqlQuery, 
            [data.email, data.password, data.nickname, data.gender]);
        const createdUser = await userService.getOneUser({type: "nickname", value: data.nickname});
        return createdUser;
    }
}

export default new AuthService();