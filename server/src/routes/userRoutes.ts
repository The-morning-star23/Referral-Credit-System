import express from "express";
import {
  getDashboardData,
  handlePurchase,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// GET /api/user/dashboard
router.get("/dashboard", getDashboardData);

// POST /api/user/purchase
router.post("/purchase", handlePurchase);

export default router;