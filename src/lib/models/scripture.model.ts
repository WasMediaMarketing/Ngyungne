// import mongoose, { Schema, Model } from "mongoose";
// import { IScripture, IVerse } from "@/types";

// // Verse Schema representing each verse in a scripture
// const VerseSchema: Schema = new Schema<IVerse>(
//   {
//     number: { type: Number, required: true },
//     chapter: { type: String, required: true },
//     text: { type: String, required: true },
//     commentary: { type: String, required: true },
//   },
//   { _id: false }
// );

// const ScriptureSchema: Schema<IScripture> = new Schema(
//   {
//     id: { type: String, required: true, unique: true },
//     title: { type: String, required: true },
//     tradition: { type: String, required: true },
//     period: { type: String, required: true },
//     language: { type: String, required: true },
//     description: { type: String, required: true },
//     overview: { type: String, required: true },
//     verses: { type: [VerseSchema], required: true },
//     significance: { type: String, required: true },
//     historicalContext: { type: String, required: true },
//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );

// ScriptureSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// const ScriptureModel: Model<IScripture> =
//   mongoose.models.Scripture || mongoose.model("Scripture", ScriptureSchema);

// export { ScriptureModel };
