// third party
import bcrypt from "bcrypt";

// local imports
import pool from "../config/db.js";
import userService from "./user-service.js";
import emailService from "./email-service.js";
import tokenService from "./token-service.js";
import { UserDto } from "../dtos/user-dto.js";
import { ApiError } from "../exceptions/api-error.js";


class AuthService {
    async logIn(email, password) {
        const user = await userService.getOneUser({type:"email", value: email});
        if(!user) {
            throw ApiError.badRequest("Sorry, user with that email doesn't exist :(");
        }

        const isEmailActivated = await emailService.isEmailActivated(user.id);
        if(!isEmailActivated) {
            throw ApiError.badRequest("Email isn't activated. Visit your email and use activation link.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            throw ApiError.badRequest("Wrong password.");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return { user, tokens};
    }
    async signIn(data) {

        const { nickname, email, password, gender, activationLink } = data;

        // nickname and email check START
        const nicknameMatch = await userService.getOneUser({type:"nickname", value: nickname});
        if(nicknameMatch) {
            throw ApiError.badRequest("Sorry, such nickname already exists :(");
        }

        const emailMatch = await userService.getOneUser({type:"email", value: email});
        if(emailMatch) {
            throw ApiError.badRequest("Sorry, user with that email already exists :(");
        }
        // nickname and email check END

        const sqlRegistrationQuery = `
            START TRANSACTION; 

                INSERT INTO user ( email, password, nickname ) 
                    VALUES (?, ?, @userName := ?); 
                
                SELECT @userId := id_user FROM user WHERE nickname = @userName; 

                INSERT INTO user_data ( id_user, gender ) VALUES (@userId, ?); 

                INSERT INTO email_activation ( id_user, activation_link )
                    VALUES ( @userId, ? );
                
            COMMIT; 
        `
        const hashedPassword = await bcrypt.hash(password, 11);

        await pool.query(sqlRegistrationQuery, 
            [email, hashedPassword, nickname, gender, activationLink]);

        const user = await userService.getOneUser({type: "nickname", value: nickname});
        await emailService.sendActivationMail( email, nickname, `${process.env.API_URL}/user/activate-account/${activationLink}` );

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return { user, tokens};
    }
}

export default new AuthService();