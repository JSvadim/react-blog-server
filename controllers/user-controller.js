import userService from "../services/user-service.js";

class UserController {
    async getOneUser(req, res) {
        try {
            // uses only query parameter to get user(nickname, id, email);
            const selectorType = Object.keys(req.query)[0];
            const selector = { 
                type: selectorType,
                value: req.query[selectorType]
            }
            const user = await userService.getOneUser(selector);
            res.json(user);
        } catch(e) {
            res.status(500);
            throw e;
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch(e) {
            res.status(500);
            throw e;
        }
    }
    async updateUser(req, res) {
        //TODO
        try {
            const updatedUser = await userService.updateUser(req.body);
            res.json(updatedUser);
        } catch(e) {
            res.status(500);
            throw e;
        }
    }
}

export default new UserController();