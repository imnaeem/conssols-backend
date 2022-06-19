import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  companySignup: Boolean,
  userImage: { type: String, default: "" },
  type: String,

  registerAt: {
    type: Date,
    default: new Date(),
  },
});

const UserProfile = mongoose.model("UserProfile", userSchema);

export default UserProfile;
