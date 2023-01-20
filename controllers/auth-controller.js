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
                    httpOnly: true,
                    // remove both next keys after deploy on same domain
                    sameSite: "none",
                    secure: true
                }
            )
            userData.user.password = '';
            res.json({
                user: userData.user, 
                token: userData.tokens.accessToken
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
                    httpOnly: true,
                    // remove both next keys after deploy on same domain
                    sameSite: "none",
                    secure: true
                }
            );
            createdUser.user.password = '';
            res.json({
                user: createdUser.user,
                token: createdUser.tokens.accessToken,
            });
        } catch(e) {
            next(e);
        }
    }

    async logOut(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await authService.logOut(refreshToken);
            res.clearCookie("refreshToken");
            res.status(200).json("logged out");
        } catch(e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            userData.user.password = '';
            res.json({
                user: userData.user,
                token: userData.accessToken
            });
        } catch(e) {
            next(e);
        }
    }

}

export default new AuthController();