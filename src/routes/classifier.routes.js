import { Router } from "express";
import auth from "../middleware/auth.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import classifierController from "../controllers/classifier.controller.js";

const router = Router();

router.get(`/`, auth, checkBlacklist, classifierController.list);
router.post(`/`, auth, checkBlacklist, classifierController.create);
router.patch(`/:id`, auth, checkBlacklist, classifierController.update);
router.delete(`/:id`, auth, checkBlacklist, classifierController.deleteClassified);

export default router;