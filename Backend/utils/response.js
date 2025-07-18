/**
 * Custom response middleware to standardize the API response format.
 * 
 * @param {Object} res - The response object to send the response.
 * @param {string} message - The message to be included in the response.
 * @param {any} [data=null] - The data to be included in the response. Defaults to null if not provided.
 * @returns {void} Sends the formatted response to the client.
 * 
 * Example response:
 * {
 *   "status": true,
 *   "message": "Operation successful",
 *   "data": { ... }
 * }
 */
const customResponse = (res, message, data = null) => {
    const response = {
        status: true,
        message: message,
        data: data
    };

    res.json(response);
};

module.exports = customResponse;
