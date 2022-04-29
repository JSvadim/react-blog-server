//local imports
import { ApiError } from "../exceptions/api-error.js";
import tokenService from "../services/token-service.js";

export function authMiddleware (req, res, next) {
    try { 
        
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return next(ApiError.unauthorizedUser())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken) {
            return next(ApiError.unauthorizedUser())
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return next(ApiError.unauthorizedUser())
        }

        req.user = userData;
        next();

    } catch(e) {
        return next(ApiError.unauthorizedUser())
    }
}