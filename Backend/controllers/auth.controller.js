const { UserService } = require("../services/user.service");
const customResponse = require("../utils/response");

class AuthController {
    constructor() {
        this.userService = new UserService();
    }

    register = async (req, res, next) => {
        try {
            const payload = req.body;
            payload.role = "user";
            const response = await this.userService.register(payload);
            customResponse(
                res,
                "Registration successful. Please verify your email.",
                response
            );
        } catch (error) {
            next(error);
        }
    };

  
    verifyEmailOtp = async (req, res, next) => {
        try {

            const { email, otp } = req.body;
            const response = await this.userService.verifyEmailOtp(email, otp);
            customResponse(res, response.message);
        } catch (error) {
            next(error);
        }
    };

   
    requestLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "user",
            };
            await this.userService.requestLoginOtp(payload);
            customResponse(res, "OTP sent for login.");
        } catch (error) {
            next(error);
        }
    };

    requestAdminLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "admin",
            };
            await this.userService.requestLoginOtp(payload);
            customResponse(res, "OTP sent for admin login.");
        } catch (error) {
            next(error);
        }
    };

   
    verifyLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "user",
            };
            const response = await this.userService.verifyLoginOtp(payload);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
               
                sameSite: "Lax", 
                path: "/",
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            });

            res.cookie("accessToken", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
               
                sameSite: "Lax", 
                path: "/",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Login successful", response.returnData);
        } catch (error) {
            next(error);
        }
    };

   
    verifyAdminLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: "admin",
            };
            const response = await this.userService.verifyLoginOtp(payload);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", 

                path: "/",
                maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            });

            res.cookie("accessToken", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", 

                path: "/",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Admin login successful", response.returnData, response.accessToken);
        } catch (error) {
            next(error);
        }
    };

  
    requestPasswordReset = async (req, res, next) => {
        try {
            const payload = req.body;
            await this.userService.requestPasswordReset(payload);
            customResponse(res, "Password reset OTP sent successfully.");
        } catch (error) {
            next(error);
        }
    };

 
    resetPassword = async (req, res, next) => {
        try {
            const payload = req.body;
            await this.userService.resetPassword(payload);
            customResponse(res, "Password reset successfully.");
        } catch (error) {
            next(error);
        }
    };


    resendEmailVerificationOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            await this.userService.resendEmailVerificationOtp(email);
            customResponse(res, "Email verification OTP resent successfully.");
        } catch (error) {
            next(error);
        }
    };


    resendLoginOtp = async (req, res, next) => {
        try {
            const payload = {
                ...req.body,
                role: req.body.role || "user",
            };
            await this.userService.resendLoginOtp(payload);
            customResponse(res, "Login OTP resent successfully.");
        } catch (error) {
            next(error);
        }
    };


    refreshToken = async (req, res, next) => {
        try {
            const response = await this.userService.refreshToken(req);

            res.cookie("accessToken", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", 

                path: "/",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            customResponse(res, "Access token refreshed successfully.");
        } catch (error) {
            next(error);
        }
    };

    getMe = async (req, res, next) => {
        try {
            const user = await this.userService.getMe(req);
            
            customResponse(res, "user Data get successfully", user);
        } catch (error) {
            next(error);
        }
    }

    getUserByID = async (req,res,next)=>{
        try {
            const {id} = req.params
            const user = await this.userService.getUserByID(id);
            return customResponse(res, "User data get successfully", user)
        } catch (error) {
            next(error)
        }
    }


    getall = async(req,res,next)=>{
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const users = await this.userService.getall(page, limit, filters)
            
            return customResponse(res, "Users fetched successfully", users)
        } catch (error) {
            next(error)
        }
    }


    changePassword = async (req, res, next) => {
        try {
            const payload = req.body;
            const id = req.user.id;
            await this.userService.changeUserPassword(payload, id);
            return customResponse(res, "Password changed successfully");
        } catch (error) {
            next(error)
        }
    }

    updateProfile = async (req, res, next)=>{
        try {
            const payload = req.body;
             
            const id = req.user.id;
            const result = await this.userService.updateProfile(payload, id);
            return customResponse(res, "User updated successfully", result);
        } catch (error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        try {

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", 

                path: "/",

            });

            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax", 

                path: "/",

            });
            customResponse(res, "logout successful")
        }
        catch (error) {
            next(error)
        }
    }


    activate = async(req, res, next)=>{
        try {
            const {id} = req.params;

            const response = await this.userService.activate(id)
            return customResponse(res, `${response.fullName} account activate successfully`)
        } catch (error) {
            next(error)
        }
    }


    deactivate = async(req, res, next)=>{
        try {
            const {id} = req.params;

            const response = await this.userService.deactivate(id)
            return customResponse(res, `${response.fullName} account deactivate successfully`)
        } catch (error) {
            next(error)
        }
    }

    removeProfileImage = async(req,res,next)=>{
        try {
            const id = req.user._id;
            const name = req.user.fullName;
            await this.userService.removeProfileImage(id, name);
            return customResponse(res, `${name} profile deleted successfully`);
        } catch (error) {
            next(error)
        }
    }
}

exports.AuthController = AuthController;
