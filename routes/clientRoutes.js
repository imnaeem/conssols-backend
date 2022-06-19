import express from "express";
import {
  addClientProject,
  getClientProjects,
  closeClientProject,
  acceptCompanyProposal,
  getProposalCompany,
  getProjectsToReview,
  cleintAddReview,
  getClientReviews,
} from "../controllers/client.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add-project", auth, addClientProject);

router.get("/projects", auth, getClientProjects);

router.patch("/projects", auth, closeClientProject);

router.patch("/:id/proposals", auth, acceptCompanyProposal);

router.get("/:id/proposals", auth, getProposalCompany);

router.get("/reviews", auth, getProjectsToReview);

router.post("/reviews", auth, cleintAddReview);

router.get("/view-all-reviews", auth, getClientReviews);

export default router;
