const { verifyAccessToken } = require("../utils/jwt");
const User = require('../models/user.model');
const { USER_STATUS } = require("../constants/enums");

/**
 * Middleware to authenticate and authorize based on roles.
 * 
 * @param {Array<string>} allowedRoles - Array of roles allowed to access the route.
 */
const authorize = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            // const authHeader = req.headers.authorization;
            // if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // const error = new Error("Unauthorized: Token not provided");
            // error.statusCode = 401;
            // next(error)
            // }

            // const token = authHeader.split(" ")[1] || null;
            const token = req.cookies.accessToken;
            if (!token) {
                const error = new Error("Unauthorized: Token not provided");
                error.statusCode = 401;
                next(error)
            }

            const decoded = verifyAccessToken(token);
            if (!decoded) {
                const error = new Error("Unauthorized: Invalid token");
                error.statusCode = 401;
                next(error)
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 401;
                next(error)
            }

            if(user.status !== USER_STATUS.ACTIVE){
                const error = new Error("Your account is inactive. You can't log in. Please contact the admin");
                error.statusCode = 403;
                next(error)
            }

            if (!allowedRoles.includes(user.role)) {
                const error = new Error("Forbidden: You do not have access");
                error.statusCode = 403;
                next(error)
            }

            req.user = user;
            next();
        } catch (error) {
            error.message = "Unauthorized: Token verification failed";
            error.statusCode = 401;
            next(error)
        }
    };
};

module.exports = authorize;
