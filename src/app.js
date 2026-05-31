import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { swaggerDocs } from "./config/swagger.js";

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";

const defaultAllowedOrigins = [
    "https://frontend-sample-model.vercel.app",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

const envAllowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS,
]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

function isAllowedOrigin(origin) {
    if (!origin) return true;
    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedOrigins.has(normalizedOrigin)) return true;

    try {
        const { hostname, protocol } = new URL(normalizedOrigin);
        return protocol === "https:" && hostname.endsWith(".app.github.dev");
    } catch {
        return false;
    }
}

const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

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
        apiRoot: `/${NODE_ENV}/api`,
        v1: `/v1`,
        docs: `/${NODE_ENV}/api/docs`,
    });
});

app.get(`/v1`, (req, res) => {
    res.json({
        message: "Api v1 respondendo no container docker...",
        chamada_em: new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        }),
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
