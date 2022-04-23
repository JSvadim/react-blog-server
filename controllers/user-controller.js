import userService from "../services/user-service.js";

class UserController {
    async getOneUser(req, res, next) {
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
            next(e);
        }
    }
    async activate(req, res) {
        try {
            await userService.activate(req.params.link);
            res.redirect(process.env.CLIENT_URL);
        } catch(e) {
            next(e);
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch(e) {
            next(e);
        }
    }
    async updateUser(req, res) {
        //TODO
        try {
            const updatedUser = await userService.updateUser(req.body);
            res.json(updatedUser);
        } catch(e) {
            next(e);
        }
    }
}

export default new UserController();