import { Router } from "express";
import auth from "../middleware/auth.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import productsController from "../controllers/products.controller.js";
import multer from "multer";
import uploadConfig from "../config/upload.js";

const router = Router();
const upload = multer(uploadConfig);
// Defina as rotas de produtos aqui

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos ativos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   imageId:
 *                     type: string
 *                     nullable: true
 *                   image:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       originalName:
 *                         type: string
 *                       fileName:
 *                         type: string
 *                       mimeType:
 *                         type: string
 *                       size:
 *                         type: integer
 *                       path:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                   active:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro interno do servidor
 */
router.get(`/`, productsController.list);
//router.get(`/`, auth, checkBlacklist, productsController.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID (inclui imagem se existir)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 imageId:
 *                   type: string
 *                   nullable: true
 *                 image:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     path:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 active:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Produto não encontrado
 */
router.get(`/:id`, productsController.getById);
//router.get(`/:id`, auth, checkBlacklist, productsController.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto (campo image opcional)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Notebook Gamer
 *                 description: Nome do produto (mínimo 3 caracteres)
 *               description:
 *                 type: string
 *                 example: Notebook com placa RTX
 *                 description: Descrição do produto (mínimo 5 caracteres)
 *               price:
 *                 type: number
 *                 example: 4500
 *                 description: Preço do produto (maior que 0)
 *               stock:
 *                 type: integer
 *                 example: 10
 *                 description: Quantidade em estoque (inteiro >= 0)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem opcional do produto (jpeg, png ou gif)
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 imageId:
 *                   type: string
 *                   nullable: true
 *                 active:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro de validação (nome, descrição, preço, estoque ou imagem inválidos)
 *       500:
 *         description: Erro interno do servidor
 */
router.post(`/`, auth, checkBlacklist, upload.single(`image`), productsController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza dados do produto (parcial ou completo). Campos opcionais.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Notebook Atualizado
 *                 description: Se informado, mínimo 3 caracteres
 *               description:
 *                 type: string
 *                 description: Se informado, mínimo 5 caracteres
 *               price:
 *                 type: number
 *                 description: Se informado, maior que 0
 *               stock:
 *                 type: integer
 *                 description: Se informado, inteiro >= 0
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem (jpeg, png ou gif)
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 imageId:
 *                   type: string
 *                   nullable: true
 *                 active:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro de validação ou nenhum campo para atualizar
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(`/:id`, auth, checkBlacklist, upload.single(`image`), productsController.update);

/**
 * @swagger
 * /products/{id}/toggle:
 *   patch:
 *     summary: Ativa ou desativa um produto (toggle de campo `active`)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto com status alternado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 active:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch(`/:id/toggle`, auth, checkBlacklist, productsController.toggleActive);

export default router;