const swaggerJSDoc = require("swagger-jsdoc");
const authSchemas = require("./schemas/auth.schemas");
const responseSchema = require("./schemas/response.schema");

const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tanker E-Commerce API",
            version: "1.0.0",
            description:
                "API documentation for the Tanker E-Commerce backend system.",
        },
        servers: [
            {
                url: `http://localhost:${port}/api`,
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                ...authSchemas,
            },
            responses: {
                ...responseSchema,
            },
        },
    },
    apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
