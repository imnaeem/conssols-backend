import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  details: String,
  location: String,
  rate: String,
  projectImage: String,

  status: {
    type: String,
    default: "active",
  },

  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyProfile",
    default: null,
  },

  reviewed: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
