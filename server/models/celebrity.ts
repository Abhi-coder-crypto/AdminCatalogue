import { Schema, Document } from "mongoose";
import type { Celebrity } from "@shared/schema";
import { celebrityConnection } from "../mongodb";

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
      required: true,
    },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    achievements: { type: [String] },
    socialLinks: { type: [String], default: [] },
    videoUrl: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    language: {
      type: [String],
      required: true,
    },
    location: { type: String, required: true },
    priceRange: {
      type: String,
    },
    eventTypes: {
      type: [String],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CelebrityModel = celebrityConnection.model<CelebrityDocument>(
  "Celebrity",
  celebritySchema
);
