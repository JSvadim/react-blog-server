import userService from "../services/user-service.js";

class UserController {
    async getOneUser(req, res, next) {
        try {
            // uses nickname or id or email to get user
            const selector = { 
                type: req.query.selector,
                value: req.query.value
            }
            const user = await userService.getOneUser(selector);
            user.password = '';
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