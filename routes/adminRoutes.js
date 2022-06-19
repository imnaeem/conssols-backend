import express from "express";
import {
  getAllPromotions,
  updatePromotionStatus,
  getAllMessages,
} from "../controllers/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/promotions", auth, getAllPromotions);

router.patch("/promotions", auth, updatePromotionStatus);
router.get("/messages", auth, getAllMessages);

export default router;
