import { Router } from "express";
import auth from "../middleware/auth.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import ordersController from "../controllers/orders.controller.js";

const router = Router();

// Defina as rotas de pedidos aqui

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get order summary
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders summary
 */
router.get(`/`, auth, checkBlacklist, ordersController.summary);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created
 */
router.post(`/`, auth, checkBlacklist, ordersController.create);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - PAID
 *                   - SHIPPED
 *                   - CANCELED
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Order updated
 */
router.patch(`/:id/status`, auth, checkBlacklist, ordersController.updateStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Order canceled
 */
router.delete(`/:id`, auth, checkBlacklist, ordersController.cancel);

export default router;