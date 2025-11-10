import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lina@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               referralCode:
 *                 type: string
 *                 example: "RYAN456"
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request (e.g., user exists)
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lina@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Login successful, returns user and token
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

export default router;
