module.exports = {
    RegisterRequest: {
        type: 'object',
        required: ['companyEmail', 'companyName', 'fullName', 'designation', 'mobileNumber', 'country', 'preferredLanguage', 'communicationPreference', 'password', 'confirmPassword'],
        properties: {
            companyEmail: { type: 'string', format: 'email' },
            companyName: { type: 'string' },
            fullName: { type: 'string' },
            designation: { type: 'string' },
            mobileNumber: { type: 'string' },
            alternativeEmail: { type: 'string', format: 'email', nullable: true },
            country: { type: 'string' },
            preferredLanguage: { type: 'string' },
            communicationPreference: { type: 'string', enum: ['email', 'sms', 'call'] },
            password: { type: 'string', format: 'password' },
            confirmPassword: { type: 'string', format: 'password' }
        }
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
        }
    },
    VerifyLoginRequest: {
        type: 'object',
        required: ['email', 'password', 'otp'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            otp: { type: 'string', minLength: 6, maxLength: 6 }
        }
    },
    EmailOnlyRequest: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', format: 'email' }
        }
    },
    ResetPasswordRequest: {
        type: 'object',
        required: ['email', 'otp', 'newPassword'],
        properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6 },
            newPassword: { type: 'string', format: 'password' }
        }
    }
};
