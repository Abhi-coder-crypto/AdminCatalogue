import mongoose, { Schema, Document } from "mongoose";
import type { Celebrity } from "@shared/schema";

export interface CelebrityDocument extends Omit<Celebrity, "_id">, Document {}

const socialLinkSchema = new Schema({
  platform: {
    type: String,
    enum: ["Instagram", "YouTube", "Twitter", "Facebook"],
    required: true,
  },
  url: { type: String, required: true },
}, { _id: false });

const celebritySchema = new Schema<CelebrityDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        "Singers",
        "Actors",
        "Comedians",
        "Influencers",
        "Choreographers",
        "Chefs",
        "Motivational Speakers",
      ],
      required: true,
    },
    profileImage: { type: String, required: true },
    bio: { type: String, required: true },
    achievements: { type: [String], required: true },
    socialLinks: { type: [socialLinkSchema], default: [] },
    videoUrl: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    languages: {
      type: [String],
      enum: [
        "Hindi",
        "English",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Kannada",
        "Malayalam",
        "Urdu",
      ],
      required: true,
    },
    location: { type: String, required: true },
    priceRange: {
      type: String,
      enum: ["Budget", "Mid-Range", "Premium"],
      required: true,
    },
    eventTypes: {
      type: [String],
      enum: ["Wedding", "Concert", "Corporate", "Private Party"],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const CelebrityModel = mongoose.model<CelebrityDocument>(
  "Celebrity",
  celebritySchema
);
