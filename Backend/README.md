# Tanker Solution Backend

## 🚀 Setup & Running Locally

### 1. Clone the Repository

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update `.env` with your actual values such as:

- MongoDB URI
- JWT secrets
- SMTP credentials (for sending OTP emails)

### 4. Start the Server

Start in development mode (with auto-restart):

```bash
npm run dev
```

Or run in production:

```bash
npm start
```

---

## 📦 Available Scripts

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm start`             | Start server in **production**                   |
| `npm run dev`           | Start server in **development** with watcher     |
| `npm test`              | Run tests (if configured with Jest)              |
| `npm run queue:dev`     | Start **queue worker locally** using `nodemon`   |
| `npm run queue:prod`    | Start **queue worker in production** using `PM2` |
| `npm run queue:stop`    | Stop the queue worker via PM2                    |
| `npm run queue:restart` | Restart the queue worker via PM2                 |
| `npm run queue:logs`    | Show live logs for the queue worker via PM2      |

---

## 📁 Folder Structure (Simplified)

```
Backend/
├── config/               # App-level configuration (e.g., DB, app settings)
├── constants/            # Reusable constants and enums
├── controllers/          # Express route controllers (AuthController, etc.)
├── docs/                 # API documentation (e.g., Swagger YAML/JSON files)
├── middlewares/          # Express middleware functions (auth, validation, etc.)
├── models/               # Mongoose schemas and models
│   ├── cms/              # CMS-specific models (if needed)
├── plugins/              # Custom plugins (e.g., encryption, hooks)
├── public/               # Static assets (uploads, files, etc.)
├── queues/               # BullMQ queue setup
│   ├── index.js          # Queue instance (BullMQ)
│   ├── redis.js          # Redis client config
│   └── worker.js         # Job processing worker
├── repositories/         # Data access layer
│   ├── cms/              # CMS-specific repositories
├── requestSchemas/       # Zod validation schemas
├── routes/               # Express route definitions and middlewares
├── services/             # Business logic layer (e.g., UserService)
├── utils/                # Helper utilities (JWT, OTP, email, etc.)
├── .env                  # Environment variables
├── .env.example          # Sample environment config
└── server.js             # Express app bootstrap/entry point
```

---

## 🧠 Layered Responsibilities

| Layer            | Responsibility                                                             |
| ---------------- | -------------------------------------------------------------------------- |
| **Controllers**  | Handle HTTP requests/responses, invoke service logic                       |
| **Services**     | Encapsulate business logic, workflows, validations, token generation, etc. |
| **Repositories** | Abstract MongoDB interactions (CRUD, queries) using Mongoose               |
| **Models**       | Define data schemas and validation via Mongoose                            |
| **Plugins**      | Custom Mongoose plugins (like AES field encryption)                        |
| **Middlewares**  | Validation with Zod, error handling, authentication checks                 |
| **Utils**        | Reusable helpers (OTP, JWT, email sender, encryption, etc.)                |

---

## 🔐 Encryption in This Project

-   1. AES-256 (Implemented Now)
-   2. Searchable Encryption (Coming Later)

### 1. AES-256 Encryption (Symmetric Encryption)

- 🔧 What is it?
    - AES-256 is a strong encryption algorithm that uses a secret key to encrypt and decrypt data.

- 🔐 What is it good for?
    - Hiding sensitive values (e.g., phone numbers, alt emails)
    - Strong protection — only decryptable if you have the key

- ❌ What it's not good for? - You can't search or filter encrypted fields using .find({ field: value })
  (because encrypted data looks like gibberish)

#### 📦 How AES-256 Is Working in This Project

We use a custom Mongoose plugin: `encryptionPlugin`.

- **On Save**: The plugin encrypts specified fields before saving to MongoDB.
- **On Read**: It automatically decrypts the fields when you query documents.

Example:

```js
// Saving encrypted fields
await User.create({
    mobileNumber: "+919999999999",
    alternativeEmail: "secret@email.com",
});

// Reading decrypted value
const user = await User.findById(id);
console.log(user.mobileNumber); // ➡ Decrypted output
```

### 2. Searchable Encryption (Planned - e.g., Blind Index)

This is used when we want to filter/query encrypted data like:

```js
await User.find({ mobileNumber: "+919999999999" });
```

Since AES makes values unreadable, you can't search them directly.
Searchable encryption solves that by:

- Creating "blind indexes" for encrypted fields
- Indexes are securely searchable, but don’t reveal original value

### 🔄 When to Use Which?

| Use Case                         | Use AES-256 (Now) | Use Searchable (Later)  |
| -------------------------------- | ----------------- | ----------------------- |
| Just protect data                | ✅ Yes            | 🚫 Not needed           |
| Search/filter on encrypted field | ❌ Not possible   | ✅ Yes, supports search |

### Summary

| Feature             | AES-256        | Searchable (planned)     |
| ------------------- | -------------- | ------------------------ |
| Encryption strength | 🔐 Very strong | 🔐 Strong                |
| Search supported    | ❌ No          | ✅ Yes (via blind index) |
| Use case            | Safe storage   | Search + storage         |
| Status in project   | ✅ Implemented | 🔜 Coming soon           |

---

## ✅ Developer Tips

    - Keep logic in services, never inside controllers.
    - Keep controllers thin — max 20–30 lines ideally.
    - Store business enums and constants centrally (/constants).
    - Use zod for request body validation.
    - Use customError() and customResponse() for uniform error/response handling.
    - Use AES field encryption plugin to protect sensitive fields.
    - Always abstract Mongo queries using repositories.
