const contactRepository = require("../repositories/contact.repository");
const customError = require("../utils/error");
const { default: mongoose } = require("mongoose");

/**
 * ContactService handles Contact Us form operations.
 */
class ContactService {
    /**
     * Submits a new contact inquiry.
     * @param {Object} contactData - Contact form data.
     * @returns {Promise<Object>} - Created contact document.
     */
    async submitContact(contactData) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const contact = await contactRepository.create(contactData, session);

            await session.commitTransaction();
            return contact;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    /**
     * Retrieves paginated contact submissions, optionally filtered by provided criteria.
     *
     * @param {Object} filters - MongoDB query filters (e.g., { email: "test@example.com" }).
     * @param {number} [page=1] - Page number for pagination.
     * @param {number} [limit=10] - Number of records per page.
     * @returns {Promise<Object>} - Paginated result containing docs, totalDocs, limit, page, etc.
     */
    async getAllContacts(filters, page = 1, limit = 10) {
        return await contactRepository.paginate(filters, page, limit, { createdAt: -1 });
    }

    /**
     * Deletes a contact submission by ID.
     * @param {string} contactId - The ID of the contact to delete.
     * @returns {Promise<Object|null>} - Deleted contact or null.
     */
    async deleteContact(contactId) {
        const contact = await contactRepository.findById(contactId);
        if (!contact) {
            throw customError("Contact entry not found", 404);
        }

        return await contactRepository.deleteById(contactId);
    }
}

module.exports = { ContactService };
