import mongoose, { Schema, Types, Model } from "mongoose";
import { IRegisterRetreatData } from "@/types";

const RegisterRetreatSchema: Schema<IRegisterRetreatData> =
  new Schema<IRegisterRetreatData>(
    {
      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      retreatId: {
        type: Types.ObjectId,
        ref: "Retreat",
        required: true,
      },
      MeditationExperience: {
        type: String,
        required: true,
      },
      dietaryRestriction: {
        type: String,
      },
      specialRequest: {
        type: String,
      },
      AccomodationType: {
        type: String,
        required: true,
      },
      emergencyContactName: {
        type: String,
        required: true,
      },
      emergencyContactNumber: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const RegisterRetreat =
  (mongoose.models.RegisterRetreat as Model<IRegisterRetreatData>) ||
  mongoose.model<IRegisterRetreatData>(
    "RegisterRetreat",
    RegisterRetreatSchema
  );

export { RegisterRetreat };
