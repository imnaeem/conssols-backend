import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema({
  id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  timeline: String,
  industry: String,
  summary: String,
  location: String,
  projectCost: String,
  portfolioImage: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
