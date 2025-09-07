const { ContactService } = require("../services/contact.service");
const customResponse = require("../utils/response");

class ContactController {
    constructor() {
        this.contactService = new ContactService();
    }

    /**
     * Submit a contact inquiry (Contact Us form).
     */
    submitContact = async (req, res, next) => {
        try {
            const payload = req.body;
            const response = await this.contactService.submitContact(payload);
            customResponse(res, "Your message has been submitted successfully.", response);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all submitted contact inquiries.
     */
    getAllContacts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10, filters } = req.query;
            const contacts = await this.contactService.getAllContacts(filters, page, limit);
            customResponse(res, "Contact entries fetched successfully.", contacts);
        } catch (error) {
            next(error);
        }
    };

    getContactsById = async (req, res, next) => {
        try {
            const {id} = req.params;
            const contacts = await this.contactService.getContactsById(id);
            customResponse(res, "Contact data fetch with id successfully", contacts);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a single contact inquiry by ID.
     */
    deleteContact = async (req, res, next) => {
        try {
            const contactId = req.params.id;
            await this.contactService.deleteContact(contactId);
            customResponse(res, "Contact entry deleted successfully.");
        } catch (error) {
            next(error);
        }
    };

    /**
     * Bulk delete contact inquiries by an array of IDs.
     */
    deleteManyContacts = async (req, res, next) => {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "IDs array is required." });
            }

            const deleted = await this.contactService.deleteManyContacts(ids);
            customResponse(res, `${deleted.deletedCount} contact(s) deleted successfully.`);
        } catch (error) {
            next(error);
        }
    };
}

exports.ContactController = ContactController;
