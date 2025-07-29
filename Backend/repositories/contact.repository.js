const Contact = require("../models/contact.model");
const BaseRepository = require("./base.repository");

/**
 * Repository class for interacting with the Contact collection.
 */
class ContactRepository extends BaseRepository {
    constructor() {
        super(Contact);
    }
}

module.exports = new ContactRepository();
