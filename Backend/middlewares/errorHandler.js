/**
 ** Global error handler middleware for the application.
 * This function handles errors that occur during the request lifecycle.
 *
 * @param {Error} err - The error object that was thrown during the request handling.
 * @param {Object} req - The request object containing the HTTP request data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Sends a JSON response with the error details.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorHandler;
