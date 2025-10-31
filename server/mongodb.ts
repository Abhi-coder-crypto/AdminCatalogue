import mongoose from "mongoose";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), ".mongodb-config.json");

interface MongoDBConfig {
  celebrityMongoUri: string;
}

export const adminConnection = mongoose.createConnection();
export const celebrityConnection = mongoose.createConnection();

let adminConnected = false;
let celebrityConnected = false;
let currentCelebrityUri: string | null = null;

export async function connectToAdminMongoDB(uri: string): Promise<void> {
  try {
    if (adminConnected && adminConnection.readyState === 1) {
      return;
    }

    await adminConnection.openUri(uri);
    adminConnected = true;
    console.log("Admin MongoDB connected successfully");
  } catch (error) {
    adminConnected = false;
    throw new Error(
      `Failed to connect to Admin MongoDB: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function connectToCelebrityMongoDB(uri: string): Promise<void> {
  try {
    if (celebrityConnected && currentCelebrityUri === uri && celebrityConnection.readyState === 1) {
      return;
    }

    if (celebrityConnected) {
      await celebrityConnection.close();
      celebrityConnected = false;
    }

    await celebrityConnection.openUri(uri);
    celebrityConnected = true;
    currentCelebrityUri = uri;
    console.log("Celebrity MongoDB connected successfully");
  } catch (error) {
    celebrityConnected = false;
    currentCelebrityUri = null;
    throw new Error(
      `Failed to connect to Celebrity MongoDB: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function saveCelebrityMongoConfig(uri: string): void {
  const config: MongoDBConfig = { celebrityMongoUri: uri };
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function loadCelebrityMongoConfig(): MongoDBConfig | null {
  try {
    if (existsSync(CONFIG_PATH)) {
      const data = readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error loading Celebrity MongoDB config:", error);
    return null;
  }
}

export function getConnectionStatus(): { connected: boolean; message: string } {
  if (celebrityConnected && celebrityConnection.readyState === 1) {
    return {
      connected: true,
      message: `Connected to ${celebrityConnection.name || "celebrity database"}`,
    };
  }
  return {
    connected: false,
    message: "Not connected to celebrity database",
  };
}

export async function initializeMongoDB(): Promise<void> {
  const adminMongoUri = process.env.ADMIN_MONGODB_URI;
  if (adminMongoUri) {
    try {
      await connectToAdminMongoDB(adminMongoUri);
    } catch (error) {
      console.error("Failed to auto-connect to Admin MongoDB:", error);
    }
  } else {
    console.warn("ADMIN_MONGODB_URI not set. Admin authentication will not work.");
  }

  const celebrityMongoUri = process.env.CELEBRITY_MONGODB_URI || loadCelebrityMongoConfig()?.celebrityMongoUri;
  if (celebrityMongoUri) {
    try {
      await connectToCelebrityMongoDB(celebrityMongoUri);
    } catch (error) {
      console.error("Failed to auto-connect to Celebrity MongoDB:", error);
    }
  }
}
