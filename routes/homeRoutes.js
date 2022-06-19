import express from "express";
import {
  getComapnies,
  getProjects,
  sendProposal,
  currentCompanyReviews,
  getCurrentCompany,
  sendMessage,
  getSearchedCompanies,
} from "../controllers/home.js";

const router = express.Router();

router.get("api/find-companies", getComapnies);
router.get("/find-projects", getProjects);
router.post("/find-projects", sendProposal);

router.get("/find-companies/search", getSearchedCompanies);

router.get("/company-profile/:id", getCurrentCompany);

router.get("/company-profile/:id/reviews", currentCompanyReviews);

router.post("/contact-us", sendMessage);

export default router;
