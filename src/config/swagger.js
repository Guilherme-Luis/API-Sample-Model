import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerDocs = (app) => {
    const { API_VERSION, NODE_ENV, PORT } = process.env;

    if (!API_VERSION || !NODE_ENV || !PORT) {
        throw new Error(`Variable is not defined in environment variables`);
    }

    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "API Documentation",
                version: API_VERSION,
                description: "This is the API documentation for our service.",
            },
            servers: [
                { url: `http://localhost:${PORT}/${NODE_ENV}/api` },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [{ bearerAuth: [] }],
        },
        apis: ["./src/routes/**/*.js"],
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use(`/${NODE_ENV}/api/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get(`/${NODE_ENV}/api/docs.json`, (req, res) => {
        res.json(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${PORT}/${NODE_ENV}/api/docs`);
};
