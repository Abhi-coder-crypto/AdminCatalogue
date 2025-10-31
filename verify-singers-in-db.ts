import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// All 16 singers you provided
const requestedSingers = [
  { name: "Preety & Pinky", alternateNames: ["Preety-Pinki", "Preety Pinky"] },
  { name: "Rishab Sharma", alternateNames: ["Rishabh Sharma"] },
  { name: "Sharvi Yadav", alternateNames: [] },
  { name: "Harkirat Sangha", alternateNames: ["Sartaj Sangha"] },
  { name: "Bismil", alternateNames: [] },
  { name: "Sagar Bhatia", alternateNames: ["Sagar the Soul"] },
  { name: "Kaka", alternateNames: [] },
  { name: "Sunanda Sharma", alternateNames: [] },
  { name: "Rahul Vaidya", alternateNames: [] },
  { name: "Shanmukhapriya", alternateNames: ["Shanmukhpriya"] },
  { name: "Ashish Kulkarni", alternateNames: [] },
  { name: "Arunita Kanjilal", alternateNames: [] },
  { name: "Danish Jaitly", alternateNames: ["Danish"] },
  { name: "Sawai Bhatt", alternateNames: [] },
  { name: "Anjali Gaikwad", alternateNames: [] },
  { name: "Sayli Kamble", alternateNames: ["Sayli"] }
];

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database\n");
    
    console.log("=== CHECKING ALL 16 SINGERS ===\n");
    
    let foundCount = 0;
    let missingCount = 0;
    const missing: string[] = [];
    
    for (const singer of requestedSingers) {
      const namesToCheck = [singer.name, ...singer.alternateNames];
      let found = false;
      
      for (const name of namesToCheck) {
        const slug = createSlug(name);
        const existing = await CelebrityModel.findOne({ slug });
        
        if (existing) {
          console.log(`✓ FOUND: ${singer.name} (as "${existing.name}")`);
          foundCount++;
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`✗ MISSING: ${singer.name}`);
        missing.push(singer.name);
        missingCount++;
      }
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Found in database: ${foundCount}/16`);
    console.log(`Missing from database: ${missingCount}/16`);
    
    if (missing.length > 0) {
      console.log(`\nMissing singers:`);
      missing.forEach(name => console.log(`  - ${name}`));
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
