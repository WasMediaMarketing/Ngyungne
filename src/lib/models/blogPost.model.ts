import mongoose, { Schema, Model } from "mongoose";
import { IAuthor, IBlogPost } from "@/types";

const AuthorSchema: Schema<IAuthor> = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
});

const BlogPostSchema: Schema<IBlogPost> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    readTime: { type: String },
    author: { type: AuthorSchema },
    tags: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    content: { type: String, required: true },
    image: { type: String, required: true },
    views: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    metaTitle: {
      type: String,
      required: false,
    },
    metaKeywords: {
      type: [String],
      required: false,
    },
    metaDescription: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogPostSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const BlogPost =
  (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export { BlogPost };
