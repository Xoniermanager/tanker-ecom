const Otp = require("../models/otp.model");
const User = require("../models/user.model");
const BaseRepository = require("./base.repository");


class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmailAndRole(email, role, session = null) {
        if (!email || !role) {
            throw new Error("Email and role are required to find user.");
        }

        return this.model.findOne({ companyEmail: email, role }).session(session);
    }

  
    async createOtp(email, otp, expiration, type, session = null) {
        if (!email || !otp || !expiration || !type) {
            throw new Error("Email, OTP, expiration, and type are required.");
        }

        const otpEntry = new Otp({ email, otp, expiration, type });
        await otpEntry.save({ session });
    }

   
    async findLatestOtpByEmailAndType(email, type, session = null) {
        if (!email || !type) {
            throw new Error("Email and type are required to find OTP.");
        }

        return Otp.findOne({ email, type }).sort({ createdAt: -1 }).session(session);
    }


    async compareUserPassword(id, oldPassword){
        const user = await this.model.findById(id);
    if (!user) {
        throw new Error("User not found");
    }

    return await user.comparePassword(oldPassword);
    }

    async changePassword(id, newPassword){
        const user = await this.model.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    user.password = newPassword
    await user.save()
    }

    
getUsers = async (startDate, endDate, session) => {
    // try {
        const query = {
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        
        const count = await User.countDocuments(query).session(session);
        return count;
    // } catch (error) {
    //     throw new Error(`Error getting users count: ${error.message}`);
    // }
};






}

module.exports = new UserRepository();
