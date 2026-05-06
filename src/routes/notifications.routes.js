import { Router } from "express";
import auth from "../middleware/auth.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import notificationsController from "../controllers/notifications.controller.js";
import isAdmin from "../middleware/Admin.js";

const router = Router();

// Defina as rotas de notificações aqui

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Listar notificações do usuário autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notificações listadas com sucesso
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autorizado
 */
router.get(`/`, auth, checkBlacklist, notificationsController.list);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Criar uma nova notificação
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Pedido confirmado
 *               message:
 *                 type: string
 *                 example: Seu pedido foi confirmado com sucesso
 *               type:
 *                 type: string
 *                 enum: [IN_APP, EMAIL]
 *                 example: EMAIL
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post(`/`, auth, checkBlacklist, isAdmin, notificationsController.create);

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Marcar notificação como lida
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       404:
 *         description: Notificação não encontrada
 *       401:
 *         description: Não autorizado
 */
router.patch(`/:id`, auth, checkBlacklist, notificationsController.markAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Atualizar uma notificação criada pelo usuário
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [EMAIL, SMS, PUSH, SYSTEM, ALERT]
 *               read:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Notificação não encontrada
 */
router.put(`/:id`, auth, checkBlacklist, isAdmin, notificationsController.update);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Excluir notificação criada pelo usuário
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       204:
 *         description: Notificação excluída com sucesso
 *       404:
 *         description: Notificação não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete(`/:id`, auth, checkBlacklist, isAdmin, notificationsController.deleteNotification);

export default router;
