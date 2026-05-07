import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { swaggerDocs } from "./config/swagger.js";


const app = express();
const { NODE_ENV } = process.env;

app.use(cors({
    origin: 'https://frontend-sample-model.vercel.app',
    credentials: true
}));

app.options(/(.*)/, (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://frontend-sample-model.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    return res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(`/${NODE_ENV}/api`, routes);

swaggerDocs(app);

// Health check
app.get(`/`, (req, res) => {
    res.json({
        service: `pi-services-api`,
        status: `running`,
        apiRoot: `${NODE_ENV}/api`,
        docs: `/${NODE_ENV}/api/docs`,
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || `Internal Server Error`,
    });
});

// exporta o app
export default app;