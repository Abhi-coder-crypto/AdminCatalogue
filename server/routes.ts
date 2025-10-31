import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import {
  mongoConfigSchema,
  insertCelebritySchema,
  type Celebrity,
  type InsertCelebrity,
} from "@shared/schema";
import {
  connectToMongoDB,
  saveMongoConfig,
  getConnectionStatus,
  initializeMongoDB,
} from "./mongodb";
import { CelebrityModel } from "./models/celebrity";

export async function registerRoutes(app: Express): Promise<Server> {
  await initializeMongoDB();

  app.post("/api/config/mongodb", async (req: Request, res: Response) => {
    try {
      const validation = mongoConfigSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const { mongoUri } = validation.data;

      await connectToMongoDB(mongoUri);
      saveMongoConfig(mongoUri);

      res.json({
        message: "MongoDB connection configured successfully",
        connected: true,
      });
    } catch (error) {
      console.error("MongoDB connection error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to connect to MongoDB",
      });
    }
  });

  app.get("/api/config/mongodb/status", (_req: Request, res: Response) => {
    const status = getConnectionStatus();
    res.json(status);
  });

  app.get("/api/celebrities", async (_req: Request, res: Response) => {
    try {
      const celebrities = await CelebrityModel.find().sort({ createdAt: -1 });
      const formattedCelebrities: Celebrity[] = celebrities.map((doc) => ({
        _id: (doc._id as any).toString(),
        name: doc.name,
        slug: doc.slug,
        category: doc.category,
        profileImage: doc.profileImage,
        bio: doc.bio,
        achievements: doc.achievements,
        socialLinks: doc.socialLinks,
        videoUrl: doc.videoUrl,
        gender: doc.gender,
        languages: doc.languages,
        location: doc.location,
        priceRange: doc.priceRange,
        eventTypes: doc.eventTypes,
        isFeatured: doc.isFeatured,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
      res.json(formattedCelebrities);
    } catch (error) {
      console.error("Error fetching celebrities:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to fetch celebrities",
      });
    }
  });

  app.get("/api/celebrities/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const celebrity = await CelebrityModel.findById(id);

      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }

      const formattedCelebrity: Celebrity = {
        _id: (celebrity._id as any).toString(),
        name: celebrity.name,
        slug: celebrity.slug,
        category: celebrity.category,
        profileImage: celebrity.profileImage,
        bio: celebrity.bio,
        achievements: celebrity.achievements,
        socialLinks: celebrity.socialLinks,
        videoUrl: celebrity.videoUrl,
        gender: celebrity.gender,
        languages: celebrity.languages,
        location: celebrity.location,
        priceRange: celebrity.priceRange,
        eventTypes: celebrity.eventTypes,
        isFeatured: celebrity.isFeatured,
        createdAt: celebrity.createdAt,
        updatedAt: celebrity.updatedAt,
      };

      res.json(formattedCelebrity);
    } catch (error) {
      console.error("Error fetching celebrity:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to fetch celebrity",
      });
    }
  });

  app.post("/api/celebrities", async (req: Request, res: Response) => {
    try {
      const validation = insertCelebritySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const data: InsertCelebrity = validation.data;

      const existingSlug = await CelebrityModel.findOne({ slug: data.slug });
      if (existingSlug) {
        return res.status(400).json({
          message: "A celebrity with this slug already exists",
        });
      }

      const celebrity = new CelebrityModel(data);
      await celebrity.save();

      const formattedCelebrity: Celebrity = {
        _id: (celebrity._id as any).toString(),
        name: celebrity.name,
        slug: celebrity.slug,
        category: celebrity.category,
        profileImage: celebrity.profileImage,
        bio: celebrity.bio,
        achievements: celebrity.achievements,
        socialLinks: celebrity.socialLinks,
        videoUrl: celebrity.videoUrl,
        gender: celebrity.gender,
        languages: celebrity.languages,
        location: celebrity.location,
        priceRange: celebrity.priceRange,
        eventTypes: celebrity.eventTypes,
        isFeatured: celebrity.isFeatured,
        createdAt: celebrity.createdAt,
        updatedAt: celebrity.updatedAt,
      };

      res.status(201).json(formattedCelebrity);
    } catch (error) {
      console.error("Error creating celebrity:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to create celebrity",
      });
    }
  });

  app.put("/api/celebrities/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const validation = insertCelebritySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const data: InsertCelebrity = validation.data;

      const existingSlug = await CelebrityModel.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return res.status(400).json({
          message: "A celebrity with this slug already exists",
        });
      }

      const celebrity = await CelebrityModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );

      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }

      const formattedCelebrity: Celebrity = {
        _id: (celebrity._id as any).toString(),
        name: celebrity.name,
        slug: celebrity.slug,
        category: celebrity.category,
        profileImage: celebrity.profileImage,
        bio: celebrity.bio,
        achievements: celebrity.achievements,
        socialLinks: celebrity.socialLinks,
        videoUrl: celebrity.videoUrl,
        gender: celebrity.gender,
        languages: celebrity.languages,
        location: celebrity.location,
        priceRange: celebrity.priceRange,
        eventTypes: celebrity.eventTypes,
        isFeatured: celebrity.isFeatured,
        createdAt: celebrity.createdAt,
        updatedAt: celebrity.updatedAt,
      };

      res.json(formattedCelebrity);
    } catch (error) {
      console.error("Error updating celebrity:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to update celebrity",
      });
    }
  });

  app.delete("/api/celebrities/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const celebrity = await CelebrityModel.findByIdAndDelete(id);

      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }

      res.json({ message: "Celebrity deleted successfully" });
    } catch (error) {
      console.error("Error deleting celebrity:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to delete celebrity",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
