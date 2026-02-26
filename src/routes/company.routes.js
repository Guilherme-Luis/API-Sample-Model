import { Router } from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/Admin.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import companyController from "../controllers/company.controller.js";
import multer from "multer";
import uploadConfig from "../config/upload.js";

const router = Router();
const upload = multer(uploadConfig);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: List companies
 *     description: Retrieve a list of companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 5
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get(`/`, auth, checkBlacklist, companyController.list);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
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
 *         description: Company found
 *       404:
 *         description: Company not found
 */
router.get(`/:id`, auth, checkBlacklist, companyController.getById);

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     description: Register a new company in the system
 *     tags: [Companies]
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
 *               - cnpj
 *             properties:
 *               name:
 *                 type: string
 *                 example: Empresa Exemplo LTDA
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-90"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contato@empresa.com
 *               phone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Logo da empresa (JPEG, PNG ou GIF)
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.post(`/`, auth, isAdmin, checkBlacklist, upload.single(`image`), companyController.create);

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Partially update a company
 *     description: Update specific company fields
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nova logo da empresa
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.patch(`/:id`, auth, isAdmin, checkBlacklist, upload.single(`image`), companyController.update);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Company deleted successfully
 */
router.delete(`/:id`, auth, isAdmin, checkBlacklist, companyController.deleteCompany);

export default router