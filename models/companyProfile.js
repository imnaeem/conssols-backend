import mongoose from "mongoose";

const companySchema = mongoose.Schema({
  id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companyName: String,
  username: { type: String, default: "" },
  tagline: String,
  email: String,
  phone: String,
  companyImage: String,
  isPromoted: { type: Boolean, default: false },

  website: String,
  employees: String,
  rate: String,
  founded: Number,
  summary: String,
  services: [{ _id: false, title: String, details: String }],
  registerAt: {
    type: Date,
    default: new Date(),
  },

  address: {
    country: String,
    state: String,
    city: String,
    streetAddress: String,
    formatted: String,
  },
});

const CompanyProfile = mongoose.model("CompanyProfile", companySchema);

export default CompanyProfile;
