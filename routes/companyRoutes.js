import express from "express";
import {
  updateCompany,
  getCompanyProfile,
  addCompanyPortfolio,
  getCompanyPortfolio,
  getCompanyProposals,
  markProjectCompleted,
  getCompanyReviews,
  promoteCompany,
  deleteCompanyPortfolio,
  getCompanyPromotions,
} from "../controllers/company.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.patch("/edit-company", auth, updateCompany);
router.get("/edit-company", auth, getCompanyProfile);

router.post("/add-portfolio", auth, addCompanyPortfolio);

router.get("/portfolio", auth, getCompanyPortfolio);

router.get("/proposals", auth, getCompanyProposals);

router.patch("/proposals", auth, markProjectCompleted);

router.get("/reviews", auth, getCompanyReviews);

router.delete("/portfolio", auth, deleteCompanyPortfolio);

router.post("/new-promotion", auth, promoteCompany);
router.get("/promotions", auth, getCompanyPromotions);

export default router;
