/**
 * Utility functions for generating and verifying JSON Web Tokens (JWTs).
 * These functions handle the creation and validation of access and refresh tokens for user authentication.
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '9cc4b70317785be8125e38adb11c7c4aee17cb78c0a6de9b4a0f254db6f24572';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '9cc4b70317785be8125e38adb11c7c4aee17cb78c0a6de9b4a0f254db6f24572';
const JWT_ISSUER = process.env.JWT_ISSUER || "9cc4b70317785be8125e38adb11c7c4aee17cb78c0a6de9b4a0f254db6f24572";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "9cc4b70317785be8125e38adb11c7c4aee17cb78c0a6de9b4a0f254db6f24572";

/**
 * Generates a JWT access token with dynamic expiry, issuer, and audience.
 * @param {string} userId - The ID of the user.
 * @param {string} role - The role of the user (e.g., 'user', 'admin').
 * @param {number} expiresInMinutes - Expiry time in minutes.
 * @returns {string} - Signed JWT access token.
 */
function generateAccessToken(userId, role, expiresInDays = 2) {
    const token = jwt.sign(
        { id: userId, role },
        JWT_SECRET,
        {
            expiresIn: `${expiresInDays}d`,
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        }
    );
    return token;
}

/**
 * Generates a JWT refresh token with dynamic expiry, issuer, and audience.
 * @param {string} userId - The ID of the user.
 * @param {number} expiresInDays - Expiry time in days (default: 30).
 * @returns {string} - Signed JWT refresh token.
 */
function generateRefreshToken(userId, expiresInDays = 15) {
    const refreshToken = jwt.sign(
        { id: userId },
        JWT_REFRESH_SECRET,
        {
            expiresIn: `${expiresInDays}d`,
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        }
    );
    return refreshToken;
}

/**
 * Verifies and decodes a JWT access token.
 * @param {string} token - The access token to verify.
 * @returns {Object|null} - Decoded token payload or null if invalid.
 */
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });
    } catch (error) {
        return null;
    }
}

/**
 * Verifies and decodes a JWT refresh token.
 * @param {string} token - The refresh token to verify.
 * @returns {Object|null} - Decoded token payload or null if invalid.
 */
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });
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
