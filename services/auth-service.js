// local imports
import pool from "../config/db.js";
import userService from "./user-service.js";
import tokenService from "./token-service.js";
import { UserDto } from "../dtos/user-dto.js";

class AuthService {
    async signIn(data) {
        const sqlQuery = `
            START TRANSACTION; 

                INSERT INTO user ( email, password, nickname ) 
                    VALUES (?, ?, @userName := ?); 
                
                SELECT @userId := id_user FROM user WHERE nickname = @userName; 

                INSERT INTO user_data ( id_user, gender ) VALUES (@userId, ?); 

                INSERT INTO email_activation ( id_user, activation_link )
                    VALUES ( @userId, ? );
                
            COMMIT; 
        `
        await pool.query(sqlQuery, 
            [data.email, data.password, data.nickname, data.gender, data.activationLink]);
            
        const user = await userService.getOneUser({type: "nickname", value: data.nickname});
        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { user, tokens};
    }
}

export default new AuthService();