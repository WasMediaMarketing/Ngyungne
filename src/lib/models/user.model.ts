import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types";

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "volunteer", "donator"],
      default: "user",
    },
    password: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },
    address: { type: String, default: "" },
    page: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      default: "",
    },
    pageTitle: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual ID to return the ObjectId as a string
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
  }
  next();
});

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export { User };
