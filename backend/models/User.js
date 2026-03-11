import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    newsletter: { type: Boolean, default: false },

    discountUsed: { type: Boolean, default: false } //new for discount

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
