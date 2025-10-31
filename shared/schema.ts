import { z } from "zod";

// MongoDB Connection Configuration
export const mongoConfigSchema = z.object({
  mongoUri: z.string().min(1, "MongoDB URI is required"),
});

export type MongoConfig = z.infer<typeof mongoConfigSchema>;

// Celebrity Schema with all required fields
export const categoryOptions = [
  "Singers",
  "Actors",
  "Actresses",
  "Comedians",
  "Influencers",
  "Choreographers",
  "Chefs",
  "Motivational Speakers",
] as const;

export const genderOptions = ["Male", "Female", "Other"] as const;

export const priceRangeOptions = ["Budget", "Mid-Range", "Premium"] as const;

export const eventTypeOptions = [
  "Wedding",
  "Concert",
  "Corporate",
  "Private Party",
] as const;

export const languageOptions = [
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
] as const;

export const socialPlatformOptions = [
  "Instagram",
  "YouTube",
  "Twitter",
  "Facebook",
] as const;

// Social Link schema
export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatformOptions),
  url: z.string().url("Must be a valid URL"),
});

// Celebrity Insert Schema (for creating/updating)
export const insertCelebritySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: z.string().min(1, "Category is required"),
  profileImage: z.string().url("Must be a valid image URL"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  achievements: z
    .array(z.string().min(1, "Achievement cannot be empty"))
    .optional()
    .default([]),
  socialLinks: z.array(socialLinkSchema).default([]),
  videoUrl: z.string().url("Must be a valid YouTube embed URL").optional().or(z.literal("")),
  gender: z.enum(genderOptions, { required_error: "Gender is required" }),
  languages: z
    .array(z.enum(languageOptions))
    .min(1, "At least one language is required"),
  location: z.string().min(1, "Location is required"),
  priceRange: z.enum(priceRangeOptions).optional(),
  eventTypes: z
    .array(z.enum(eventTypeOptions))
    .min(1, "At least one event type is required"),
  isFeatured: z.boolean().default(false),
});

// Celebrity Type (matches MongoDB document)
export type Celebrity = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  profileImage: string;
  bio: string;
  achievements?: string[];
  socialLinks: Array<{ platform: typeof socialPlatformOptions[number]; url: string }>;
  videoUrl?: string;
  gender: typeof genderOptions[number];
  languages: Array<typeof languageOptions[number]>;
  location: string;
  priceRange?: typeof priceRangeOptions[number];
  eventTypes: Array<typeof eventTypeOptions[number]>;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type InsertCelebrity = z.infer<typeof insertCelebritySchema>;

export const adminSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AdminSignup = z.infer<typeof adminSignupSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export type Admin = {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
