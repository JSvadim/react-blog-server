//third-party

//local imports
import authService from "../services/auth-service.js";

class AuthController {
    async logIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await authService.logIn(email, password);
            res.cookie("refreshToken",
                userData.tokens.refreshToken,
                {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                }
            )
            res.json({
                user: userData.user, 
                tokens: userData.tokens
            });
        } catch(e) {
            next(e)
        }
    }
    async signIn(req, res, next) {
        try {
            const { nickname, email, password, gender } = req.body;
            const genderValue = (gender === "other") ? 
                req.body.otherGender : gender;
            const createdUser = await authService.signIn({
                email,
                password,
                nickname,
                gender: genderValue,
                activationCode: req.body.activationCode ? req.body.activationCode : ''
            })
            if(!createdUser) {
                return res.json("activation mail has been sent");
            }
            res.cookie("refreshToken", 
                createdUser.tokens.refreshToken, 
                {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                }
            )
            res.json({
                "new-user": createdUser.user,
                tokens: createdUser.tokens,
                message: "registration is successful"
            })
        } catch(e) {
            next(e);
        }
    }
}

export default new AuthController();