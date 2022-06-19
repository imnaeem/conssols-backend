import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  id: String,
  email: String,
  subject: String,
  fullName: String,
  message: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
