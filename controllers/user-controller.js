import userService from "../services/user-service.js";

class UserController {
    async getOneUser(req, res) {
        try {
            const isEmail = isNaN(req.params.id);
            const selector = { 
                type: isEmail ? 'email' : 'id',
                value: isEmail ? 
                    req.params.email : 
                    req.params.id,
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