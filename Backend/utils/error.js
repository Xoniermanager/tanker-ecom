/**
 * Creates a custom error object with a message, an error code, and an HTTP status code.
 * 
 * This utility function helps in generating errors with custom message and error code,
 * allowing for better error categorization and clearer communication in the response.
 * 
 * @param {string} message - A descriptive message that explains the error.
 * @param {number} [statusCode=500] - The HTTP status code associated with the error (default is 500).
 * @param {number|string} [code=null] - The custom error code used for categorization (default is `null`).
 * 
 * @returns {Error} - A custom `Error` object with the given message, statusCode, and code.
 */
const customError = (message, statusCode = 500, code = null) => {
    const error = new Error(message);
    error.code = code || 500;
    error.statusCode = statusCode;
    return error;
};

module.exports = customError;