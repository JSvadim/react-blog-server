// third party
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// local imports
import pool from "../config/db.js";
import userService from "./user-service.js";
import emailService from "./email-service.js";
import tokenService from "./token-service.js";
import { UserDto } from "../dtos/user-dto.js";
import { ApiError } from "../exceptions/api-error.js";


class AuthService {

    async logIn(email,password) {
        const user = await userService.getOneUser({type:"email", value: email});
        if(!user) {
            throw ApiError.badRequest("Sorry, user with that email doesn't exist :(");
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

        const { nickname, email, password, gender } = data;

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
        
        if(!data.activationCode) {
            const randomString = uuidv4();
            await emailService.addActivationInfo( email, randomString);
            return await emailService.sendActivationMail( email, nickname, randomString );
        }

        const codeMatch = await emailService.checkActivationCode( email, data.activationCode);
        if(!codeMatch) {
            throw ApiError.badRequest("Your code is not correct");
        }

        const sqlRegistrationQuery = `
            START TRANSACTION; 

                INSERT INTO user ( email, password, nickname ) 
                    VALUES (?, ?, @userName := ?); 
                
                SELECT @userId := id_user FROM user WHERE nickname = @userName; 

                INSERT INTO user_data ( id_user, gender ) VALUES (@userId, ?); 
                
            COMMIT; 
        `
        const hashedPassword = await bcrypt.hash(password, 11);

        await pool.query(sqlRegistrationQuery, 
            [email, hashedPassword, nickname, gender]);
        const user = await userService.getOneUser({type: "nickname", value: nickname}); 

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return { user, tokens};
    }

    async logOut(refreshToken) {
        await tokenService.removeToken( refreshToken );
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            console.log("no refresh token");
            throw ApiError.unauthorizedUser();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const isTokenInDatabase = await tokenService.getTokenData(refreshToken);

        if(!userData || !isTokenInDatabase) {
            throw ApiError.unauthorizedUser();
        }
        const user = await userService.getOneUser({
            type: 'id_user',
            value: userData.id
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        const { accessToken } = tokens;
        
        return { user, accessToken }
    }

}

export default new AuthService();