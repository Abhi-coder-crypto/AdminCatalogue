import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import {
  mongoConfigSchema,
  insertCelebritySchema,
  adminSignupSchema,
  adminLoginSchema,
  type Celebrity,
  type InsertCelebrity,
  type Admin,
} from "@shared/schema";
import {
  connectToCelebrityMongoDB,
  saveCelebrityMongoConfig,
  getConnectionStatus,
  initializeMongoDB,
} from "./mongodb";
import { CelebrityModel } from "./models/celebrity";
import { AdminModel } from "./models/admin";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  await initializeMongoDB();

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const adminCount = await AdminModel.countDocuments();
      if (adminCount > 0) {
        return res.status(403).json({
          message: "Admin account already exists. Please contact the system administrator.",
        });
      }

      const validation = adminSignupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const { email, password, name } = validation.data;

      const admin = new AdminModel({ email, password, name });
      await admin.save();

      req.session.adminId = (admin._id as any).toString();

      const adminResponse: Admin = {
        _id: (admin._id as any).toString(),
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      res.status(201).json({ admin: adminResponse });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to create admin account",
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validation = adminLoginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const { email, password } = validation.data;

      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
        }
      });

      req.session.adminId = (admin._id as any).toString();

      const adminResponse: Admin = {
        _id: (admin._id as any).toString(),
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      res.json({ admin: adminResponse });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const admin = await AdminModel.findById(req.session.adminId);
      if (!admin) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Admin not found" });
      }

      const adminResponse: Admin = {
        _id: (admin._id as any).toString(),
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      res.json({ admin: adminResponse });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to check authentication",
      });
    }
  });

  app.get("/api/config/mongodb/status", requireAuth, (_req: Request, res: Response) => {
    const status = getConnectionStatus();
    res.json(status);
  });

  app.post("/api/config/mongodb", requireAuth, async (req: Request, res: Response) => {
    try {
      const validation = mongoConfigSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromError(validation.error).toString(),
        });
      }

      const { mongoUri } = validation.data;
      
      await connectToCelebrityMongoDB(mongoUri);
      saveCelebrityMongoConfig(mongoUri);

      res.json({ 
        message: "Celebrity MongoDB configuration saved and connected successfully",
        connected: true 
      });
    } catch (error) {
      console.error("Celebrity MongoDB configuration error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to configure Celebrity MongoDB",
      });
    }
  });

  app.get("/api/celebrities", requireAuth, async (_req: Request, res: Response) => {
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

  app.get("/api/celebrities/:id", requireAuth, async (req: Request, res: Response) => {
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

  app.post("/api/celebrities", requireAuth, async (req: Request, res: Response) => {
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

  app.put("/api/celebrities/:id", requireAuth, async (req: Request, res: Response) => {
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

  app.delete("/api/celebrities/:id", requireAuth, async (req: Request, res: Response) => {
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
