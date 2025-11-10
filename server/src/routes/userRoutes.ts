import express from "express";
import {
  getDashboardData,
  handlePurchase,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes in this file are protected
router.use(protect);

/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard data
 *       '401':
 *         description: Not authorized
 */
router.get("/dashboard", getDashboardData);

/**
 * @swagger
 * /user/purchase:
 *   post:
 *     summary: Simulate a user purchase
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Purchase message (e.g., credits awarded)
 *       '401':
 *         description: Not authorized
 */
router.post("/purchase", handlePurchase);

export default router;
