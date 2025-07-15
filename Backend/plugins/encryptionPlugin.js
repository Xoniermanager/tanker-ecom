const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 64-char hex (32-byte key)
const IV_LENGTH = 16;

/**
 * Encrypt a string using AES-256-CBC
 * @param {string} value
 * @returns {string} Encrypted value in "iv:cipher" format
 */
function encrypt(value) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt an encrypted value
 * @param {string} encrypted
 * @returns {string} Decrypted plaintext
 */
function decrypt(encrypted) {
    try {
        const [ivHex, encryptedData] = encrypted.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            ENCRYPTION_KEY,
            iv
        );
        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch {
        return encrypted; // Fallback: return raw if malformed
    }
}

/**
 * Mongoose plugin for field-level encryption & decryption
 *
 * @param {mongoose.Schema} schema - The Mongoose schema
 * @param {Object} options
 * @param {string[]} options.encryptable - Array of field names to encrypt
 */
module.exports = function encryptionPlugin(schema, options = {}) {
    const fieldsToEncrypt = options.encryptable || [];

    // Encrypt on save/create
    schema.pre("save", function (next) {
        for (const field of fieldsToEncrypt) {
            if (this[field] && typeof this[field] === "string") {
                this[field] = encrypt(this[field]);
            }
        }
        next();
    });

    // Encrypt during insertMany
    schema.pre("insertMany", function (next, docs) {
        for (const doc of docs) {
            for (const field of fieldsToEncrypt) {
                if (doc[field] && typeof doc[field] === "string") {
                    doc[field] = encrypt(doc[field]);
                }
            }
        }
        next();
    });

    // Encrypt during update
    schema.pre("findOneAndUpdate", function (next) {
        const update = this.getUpdate();
        if (!update || !update.$set) return next();

        for (const field of fieldsToEncrypt) {
            if (update.$set[field] && typeof update.$set[field] === "string") {
                update.$set[field] = encrypt(update.$set[field]);
            }
        }

        this.setUpdate(update);
        next();
    });

    // Decrypt when documents are hydrated (find, findOne, findById)
    schema.post("init", function (doc) {
        for (const field of fieldsToEncrypt) {
            if (doc[field] && typeof doc[field] === "string") {
                doc[field] = decrypt(doc[field]);
            }
        }
    });

    // Decrypt when converting to object (e.g., API response)
    const decryptFields = (obj) => {
        for (const field of fieldsToEncrypt) {
            if (obj[field] && typeof obj[field] === "string") {
                obj[field] = decrypt(obj[field]);
            }
        }
        return obj;
    };

    schema.methods.toJSON = function () {
        return decryptFields(this.toObject());
    };
};
