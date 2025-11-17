const userRepository = require("../repositories/user.repository");
const { verifyCaptcha } = require("../utils/recaptcha");

const customError = require("../utils/error");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { generateOtp, sendOtpEmail } = require("../utils/otp");
const { OTP_EXPIRY_DURATION, USER_STATUS } = require("../constants/enums");
const { default: mongoose, startSession, Types } = require("mongoose");
const { tryCatch } = require("bullmq");
const { getBucketImageKey, deleteImage } = require("../utils/storage");

class UserService {
 
  async register(userData) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // const verification = await verifyCaptcha(userData.captchaToken);

      // if (!verification.success || verification.score < 0.5) {
      //   throw customError("Recaptcha is not verified please try again", 400);
      // }

      const existingUser = await userRepository.findOne(
        { companyEmail: userData.companyEmail },
        null,
        session
      );
      if (existingUser) {
        throw customError("Email is already registered", 400);
      }

      const user = await userRepository.create(userData, session);

      const otp = generateOtp();
      await sendOtpEmail(user.companyEmail, otp, "email_verification");
      await userRepository.createOtp(
        user.companyEmail,
        otp,
        Date.now() + OTP_EXPIRY_DURATION.email_verification,
        "email_verification",
        session
      );

      await session.commitTransaction();
      return user;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  /**
   * Verifies the OTP sent during registration to verify email.
   * @param {string} email - Email address of the user.
   * @param {string} otp - OTP to verify.
   * @returns {Promise<Object>} - Verification result.
   */
  async verifyEmailOtp(email, otp) {
    const isOtpValid = await this.validateOtp(email, otp, "email_verification");

    if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

    const user = await userRepository.findOne({ companyEmail: email });
    if (!user) throw customError("User not found", 400);

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
      await user.save();
    }

    return { message: "Email verified successfully" };
  }

 
  async requestLoginOtp({ email, password, role }) {
    try {
      await this.validateUserAndPassword(email, password, role);

      const otp = generateOtp();

      await sendOtpEmail(email, otp, "login_otp");
      await userRepository.createOtp(
        email,
        otp,
        Date.now() + OTP_EXPIRY_DURATION.login_otp,
        "login_otp"
      );

      return true;
    } catch (err) {
      throw err;
    }
  }

 
  async verifyLoginOtp({ email, otp, password, role }) {
    const isOtpValid = await this.validateOtp(email, otp, "login_otp");
    if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

    const user = await this.validateUserAndPassword(email, password, role);

    const accessToken = generateAccessToken(user._id, role);
    const refreshToken = generateRefreshToken(user._id);

    return {
      returnData: { user },
      refreshToken,
      accessToken,
    };
  }

 
  async requestPasswordReset({ email }) {
    const user = await userRepository.findOne({ companyEmail: email });
    if (!user) throw customError("User not found", 400);

    // Block unverified users
    if (!user.emailVerifiedAt) {
      throw customError(
        "Please verify your email before resetting password",
        403
      );
    }

    const otp = generateOtp();
    // TODO: implement queue (async) to send email
    await sendOtpEmail(email, otp, "password_reset");
    await userRepository.createOtp(
      email,
      otp,
      Date.now() + OTP_EXPIRY_DURATION.password_reset,
      "password_reset"
    );

    return true;
  }


  async resetPassword({ email, otp, newPassword }) {
    const isOtpValid = await this.validateOtp(email, otp, "password_reset");
    if (!isOtpValid) throw customError("Invalid or expired OTP", 400);

    const user = await userRepository.findOne({ companyEmail: email });
    if (!user) throw customError("User not found", 400);

    // Block unverified users
    if (!user.emailVerifiedAt) {
      throw customError("Please verify your email to refresh token", 403);
    }

    user.password = newPassword;
    await user.save();

    return { message: "Password has been reset successfully." };
  }

 
  async resendEmailVerificationOtp(email) {
    const user = await userRepository.findOne({ companyEmail: email });
    if (!user) throw customError("User not found", 400);

    if (user.emailVerifiedAt) {
      throw customError("Email is already verified", 400);
    }

    await this.resendOtpHelper(email, "email_verification");
    return { message: "Email verification OTP resent successfully" };
  }


  async resendLoginOtp({ email, password, role }) {
    await this.validateUserAndPassword(email, password, role);
    await this.resendOtpHelper(email, "login_otp");
    return { message: "Login OTP resent successfully" };
  }

  async refreshToken(req) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw customError("No refresh token provided", 400);

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw customError("Invalid refresh token", 400);

    const user = await userRepository.findById(decoded.id);
    if (!user) throw customError("User not found", 400);

    const accessToken = generateAccessToken(user._id, user.role || "user");

    return { accessToken };
  }

  async getMe(req) {
    const user = await userRepository.findById(req.user._id, null, {
      __v: 0,
      password: 0,
    });
    if (!user) throw customError("User not found", 400);
    return user.toJSON();
  }

  getUserByID = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw customError("Invalid mongoose user id object", 400);
    }

    const session = await startSession();
    try {
      session.startTransaction();

      const user = await userRepository.findById(
        id,
        session,
        "-password -refreshToken"
      );

      if (!user) {
        throw customError("User not exist or invalid", 404);
      }

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  getall = async (page = 1, limit = 10, filters) => {
    const query = {};

    if (filters.fullName) {
      query.fullName = { $regex: filters.fullName, $options: "i" };
    }

    if (filters.country) {
      query.country = { $regex: filters.country, $options: "i" };
    }

    if (filters.companyName) {
      query.companyName = { $regex: filters.companyName, $options: "i" };
    }

    if (filters.designation) {
      query.designation = { $regex: filters.designation, $options: "i" };
    }
    if (filters.status) {
      query.status = { $regex: `^${filters.status}`, $options: "i" };
    }

    try {
      const users = await userRepository.paginate(
        query,
        Number(page),
        Number(limit),
        { createdAt: -1 },
        null,
        "companyEmail companyName fullName designation country status createdAt profileImage"
      );

      return users;
    } catch (error) {
      throw error;
    }
  };

  async validateUserAndPassword(email, password, role) {
    const user = await userRepository.findByEmailAndRole(email, role);
    if (!user) throw customError("User not found", 400);

    // Block unverified users
    if (!user.emailVerifiedAt) {
      throw customError("Please verify your email before continuing", 403);
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw customError(
        "Your account is inactive. You can't log in. Please contact the admin",
        403
      );
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) throw customError("Invalid password", 400);

    return user;
  }

  async validateOtp(email, otp, type) {
    const otpData = await userRepository.findLatestOtpByEmailAndType(
      email,
      type
    );

    if (!otpData || otpData.otp != otp || Date.now() > otpData.expiration) {
      return false;
    }

    return true;
  }


  async resendOtpHelper(email, type, templateType = type) {
    const existingOtp = await userRepository.findLatestOtpByEmailAndType(
      email,
      type
    );
    if (existingOtp && existingOtp.expiration > Date.now()) {
      throw customError(
        "An OTP was already sent recently. Please wait before requesting again.",
        429
      );
    }

    const otp = generateOtp();
    await sendOtpEmail(email, otp, templateType);
    await userRepository.createOtp(
      email,
      otp,
      Date.now() + OTP_EXPIRY_DURATION[type],
      type
    );
  }

  changeUserPassword = async (payload, id) => {
    const { oldPassword, newPassword } = payload;

    const isPasswordMatch = await userRepository.compareUserPassword(
      id,
      oldPassword
    );
    if (!isPasswordMatch) {
      throw customError(
        "Your old password is incorrect, please check and try again",
        401
      );
    }

    await userRepository.changePassword(id, newPassword);
    return true;
  };

  updateProfile = async (payload, id) => {
    try {
      const result = await userRepository.update(id, payload);
      if (!result) {
        throw customError("User data not updated", 400);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  activate = async (id) => {
    if (!Types.ObjectId.isValid(id)) {
      throw customError("Invalid user id");
    }

    const session = await startSession();
    try {
      session.startTransaction();

      const user = await userRepository.findById(
        id,
        session,
        "-password -refreshToken"
      );

      if (!user) {
        throw customError("User not found", 404);
      }

      if (user.status === USER_STATUS.ACTIVE) {
        throw customError(`${user.fullName} account is already active`, 400);
      }

      user.status = USER_STATUS.ACTIVE;

      const newUser = await user.save({ session });

      if (!newUser) {
        throw customError(`${user.fullName} status not updated`, 400);
      }

      await session.commitTransaction();

      return newUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  deactivate = async (id) => {
    if (!Types.ObjectId.isValid(id)) {
      throw customError("Invalid user id");
    }

    const session = await startSession();

    try {
      session.startTransaction();
      const user = await userRepository.findById(
        id,
        session,
        "-password -refreshToken"
      );
      if (!user) {
        throw customError("User not found", 404);
      }

      if (user.status === USER_STATUS.INACTIVE) {
        throw customError(`${user.fullName}  account already deactivated`, 400);
      }

      user.status = USER_STATUS.INACTIVE;

      const updatedUser = await user.save({ session });

      if (!updatedUser) {
        throw customError("User not updated", 400);
      }

      await session.commitTransaction();
      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  removeProfileImage =async(userId, name)=>{
    const session = await startSession();
    try {
      session.startTransaction()
      const result = await userRepository.findById(userId, session);

      if(!result){
        throw customError(`${name} profile  not found`);
      }
      
      if(result.profileImage){
       const key = getBucketImageKey(result.profileImage)
       await deleteImage(key)
      }

      const removeImage = await userRepository.findByIdAndUpdate(userId, {profileImage: null}, session);
      if(!removeImage){
        throw customError(`${name} profile image not delete`);
      }
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error
    } finally{
      await session.endSession()
    }
  }
}

module.exports = { UserService };
