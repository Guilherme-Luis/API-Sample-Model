import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { swaggerDocs } from "./config/swagger.js";


const app = express();
const { NODE_ENV } = process.env;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://frontend-sample-model.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());
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