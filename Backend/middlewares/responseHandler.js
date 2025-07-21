/**
 * Global response middleware to standardize the API response structure.
 *
 * This middleware will be used for all successful responses sent from the server.
 * It ensures that all responses follow a consistent structure, including success/failure status,
 * message, and optional data.
 *
 * @param {Object} req - The request object containing HTTP request data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {Function} next - The next middleware function in the stack.
 */
const responseHandler = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        const status = data.success === undefined ? true : false;

        const response = {
            status: status,
            message: data.message || "",
            data: data.data || data,
            timestamp: new Date().toISOString(),
        };

        originalJson.call(this, response);
    };

    next();
};

module.exports = responseHandler;
