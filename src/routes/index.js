import express from "express";
import ordersRoutes from "./orders.routes.js";
import productsRoutes from "./products.routes.js";
import usersRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import notificationsRoutes from "./notifications.routes.js";
//import classifierRoutes from "./classifier.routes.js";
import companyRoutes from "./company.routes.js";
import filesRoutes from "./files.routes.js";

const router = express.Router();

const { NODE_ENV } = process.env;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Base root endpoint for health check.
 *     description: Returns some basic information about the service and its status.
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Execution successful.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Service is running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
router.use(`/auth`, authRoutes);
router.use(`/orders`, ordersRoutes);
router.use(`/products`, productsRoutes);
router.use(`/users`, usersRoutes);
router.use(`/notifications`, notificationsRoutes);
router.use(`/companies`, companyRoutes);
router.use(`/files`, filesRoutes);
//A ser implementado ainda:
//router.use(`/classifier`, classifierRoutes);

export default router;
