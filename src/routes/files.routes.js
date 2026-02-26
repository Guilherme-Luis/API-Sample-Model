import { Router } from "express";
import auth from "../middleware/auth.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import uploadMiddleware from "../config/upload.js";
import filesController from "../controllers/files.controller.js";

const router = Router();

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload de arquivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Arquivo enviado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
router.post(`/`, auth, checkBlacklist, uploadMiddleware.single(`file`), filesController.upload);

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Lista todos os arquivos
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de arquivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   originalName:
 *                     type: string
 *                   fileName:
 *                     type: string
 *                   mimeType:
 *                     type: string
 *                   size:
 *                     type: integer
 *                   path:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get(`/`, auth, checkBlacklist, filesController.list);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Buscar arquivo por ID
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do arquivo
 *     responses:
 *       200:
 *         description: Arquivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 originalName:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 mimeType:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 path:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Arquivo não encontrado
 */
router.get(`/:id`, auth, checkBlacklist, filesController.getById);

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Deletar arquivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo removido com sucesso
 *       404:
 *         description: Arquivo não encontrado
 */
router.delete(`/:id`, auth, checkBlacklist, filesController.deleteFiles);

/**
 * @swagger
 * /files/{id}/download:
 *   get:
 *     summary: Download de arquivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo retornado para download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Arquivo não encontrado
 */
router.get(`/:id/download`, auth, checkBlacklist, filesController.download);

export default router
