import mongoose from "mongoose";

const promotionSchema = mongoose.Schema({
  id: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile" },
  title: String,
  duration: String,
  cost: String,
  status: { type: String, default: "Pending" },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
