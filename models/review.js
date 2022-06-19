import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  id: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  details: String,
  score: Number,
  reviewImage: String,

  reviewedAt: {
    type: Date,
    default: new Date(),
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
