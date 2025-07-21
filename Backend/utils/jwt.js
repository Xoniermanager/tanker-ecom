/**
 * Utility functions for generating and verifying JSON Web Tokens (JWTs).
 * These functions handle the creation and validation of access and refresh tokens for user authentication.
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yourJwtSecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'yourRefreshJwtSecret';

/**
 * Generates an access token for the user.
 * The access token is used to authenticate the user for a limited period (1 hour).
 * @param {string} userId - The ID of the user for whom the token is generated.
 * @param {string} role - The role of the user (e.g., 'user', 'admin').
 * @returns {string} - The generated access token.
 */
function generateAccessToken(userId, role) {
    const token = jwt.sign(
        { id: userId, role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
}

/**
 * Generates a refresh token for the user.
 * The refresh token is used to obtain a new access token when the current one expires (expires in 7 days).
 * @param {string} userId - The ID of the user for whom the token is generated.
 * @returns {string} - The generated refresh token.
 */
function generateRefreshToken(userId) {
    const refreshToken = jwt.sign(
        { id: userId },
        JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
    return refreshToken;
}

/**
 * Verifies an access token by decoding and checking its validity.
 * @param {string} token - The access token to be verified.
 * @returns {Object|null} - Returns the decoded payload if the token is valid, or null if invalid.
 */
function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verifies a refresh token by decoding and checking its validity.
 * @param {string} token - The refresh token to be verified.
 * @returns {Object|null} - Returns the decoded payload if the token is valid, or null if invalid.
 */
function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
