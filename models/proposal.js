import mongoose from "mongoose";

const proposalSchema = mongoose.Schema({
  id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  rate: String,
  message: String,
  status: {
    type: String,
    default: "Not Accepted",
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
