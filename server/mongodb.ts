import mongoose from "mongoose";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), ".mongodb-config.json");

interface MongoDBConfig {
  mongoUri: string;
}

let isConnected = false;
let currentUri: string | null = null;

export async function connectToMongoDB(uri: string): Promise<void> {
  try {
    if (isConnected && currentUri === uri) {
      return;
    }

    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
    }

    await mongoose.connect(uri);
    isConnected = true;
    currentUri = uri;
    console.log("MongoDB connected successfully");
  } catch (error) {
    isConnected = false;
    currentUri = null;
    throw new Error(
      `Failed to connect to MongoDB: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function saveMongoConfig(uri: string): void {
  const config: MongoDBConfig = { mongoUri: uri };
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function loadMongoConfig(): MongoDBConfig | null {
  try {
    if (existsSync(CONFIG_PATH)) {
      const data = readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error loading MongoDB config:", error);
    return null;
  }
}

export function getConnectionStatus(): { connected: boolean; message: string } {
  if (isConnected && mongoose.connection.readyState === 1) {
    return {
      connected: true,
      message: `Connected to ${mongoose.connection.name || "database"}`,
    };
  }
  return {
    connected: false,
    message: "Not connected to any database",
  };
}

export async function initializeMongoDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || loadMongoConfig()?.mongoUri;
  if (mongoUri) {
    try {
      await connectToMongoDB(mongoUri);
    } catch (error) {
      console.error("Failed to auto-connect to MongoDB:", error);
    }
  }
}
