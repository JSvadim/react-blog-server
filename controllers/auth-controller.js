//third-party
import bcrypt from "bcrypt";

//local imports
import userService from "../services/user-service.js";
import authService from "../services/auth-service.js";

class AuthController {
    async logIn(req, res) {
        try {

        } catch(e) {
            console.log(e);
            res.status(500).json({
                message: `Error: ${e}`
            });
        }

    }
    async signIn(req, res) {
        try {
            const { nickname, email, password, gender } = req.body;
            // nickname and email check START
            const nicknameMatch = await userService.getOneUser({type:"nickname", value: nickname});
            if(nicknameMatch) {
                return res.status(500).json({message:"Sorry, such nickname already exists :("});
            }
            const emailMatch = await userService.getOneUser({type:"email", value: email});
            if(emailMatch) {
                return res.status(500).json({message:"Sorry, user with that email already exists :("});
            }
            // nickname and email check END
            const hashedPassword = await bcrypt.hash(password, 11);
            const genderValue = 
                (gender === "other") ? 
                req.body.otherGender : 
                gender;
            const createdUser = await authService.signIn({
                email: email,
                password: hashedPassword,
                nickname: nickname,
                gender: genderValue
            })
            res.json({
                "new-user": createdUser,
                message: "registration is successful"
            })
        } catch(e) {
            res.status(500).json({
                message: "server error",
                errorData: e
            });
        }
    }
}

export default new AuthController();