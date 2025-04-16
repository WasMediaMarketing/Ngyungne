import mongoose, { Schema, Model, Document } from "mongoose";
import { Setting, PaymentMethodType } from "@/types/setting.types";

// Define interface for the model with static methods
interface SettingModel extends Model<Setting & Document> {
  findOrCreate(): Promise<Setting & Document>;
}

const SocialLinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
});

const BankInfoSchema = new Schema({
  accountName: { type: String, required: true },
  branchName: { type: String, required: true },
  swiftCode: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  qrCode: { type: String },
});

const DigitalWalletInfoSchema = new Schema({
  id: { type: String, required: true },
  qrCode: { type: String },
});

const OtherPaymentInfoSchema = new Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  qrCode: { type: String },
});

const PaymentInfoSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(PaymentMethodType),
      required: true,
    },
    bank: { type: BankInfoSchema },
    digitalWallet: { type: DigitalWalletInfoSchema },
    other: { type: OtherPaymentInfoSchema },
    isActive: { type: Boolean, default: true },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const OrganizationInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    socialLinks: [SocialLinkSchema],
  },
  {
    _id: false,
    timestamps: false,
  }
);

const MetaInfoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [{ type: String }],
    ogImage: { type: String },
    favicon: { type: String },
    twitterHandle: { type: String },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const SettingSchema = new Schema(
  {
    organizationInfo: { type: OrganizationInfoSchema, required: true },
    paymentInfo: [{ type: PaymentInfoSchema }],
    metaInfo: { type: MetaInfoSchema, required: true },
  },
  {
    timestamps: true,
  }
);

// Define the static method with default values
SettingSchema.statics.findOrCreate = async function () {
  let setting = await this.findOne();
  if (!setting) {
    setting = await this.create({
      organizationInfo: {
        name: "Ngyungne Practice",
        address: "Jorpati, Gokarneshwor 5, Kathmandu, Nepal",
        email: "donation@ngyungne.org",
        phone: "+977 9818123174",
        socialLinks: [],
      },
      paymentInfo: [],
      metaInfo: {
        title: "Ngyungne Practice",
        description:
          "Ngyungne Practice is a serene space in Nepal dedicated to deepening spiritual practice and meditation, offering a peaceful environment for personal growth and healing through traditional methods.",
        keywords: [
          "Ngyungne Practice",
          "meditation",
          "spiritual growth",
          "Nepal retreats",
          "peaceful meditation",
          "healing practices",
          "Buddhism",
          "meditation center",
          "spiritual retreat",
          "mindfulness",
          "meditative practices",
          "Nepal wellness",
        ],
        ogImage: "https://example.com/og-image.jpg",
        favicon: "https://example.com/favicon.ico",
        twitterHandle: "@ngyungnepractice",
      },
    });
  }
  return setting;
};

// Create and export the model
const SettingModel =
  (mongoose.models.Setting as SettingModel) ||
  mongoose.model<Setting & Document, SettingModel>("Setting", SettingSchema);

export default SettingModel;
