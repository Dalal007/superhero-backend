import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      maxlength: [254, "Email is too long"],
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Email is invalid",
      },
    },
    name: { type: String, required: [true, "Name is required"], minlength: 2, maxlength: 100, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "editor", "admin"],
      default: "viewer",
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hero" }],
  },
  { timestamps: true }
);

// Database-level unique index with case-insensitive collation safety
userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.setPassword = async function (pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 10);
};

userSchema.methods.validatePassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export default mongoose.model("User", userSchema);
