import express from "express";
import {
  signup,
  signin,
  updateUserProfile,
  getUserProfile,
} from "../controllers/auth.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/profile", auth, updateUserProfile);
router.get("/profile", auth, getUserProfile);

export default router;
