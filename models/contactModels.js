import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export const Contact = mongoose.model("contact", contactSchema);
