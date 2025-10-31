import { readFileSync } from "fs";
import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

const singersText = readFileSync("attached_assets/Pasted-List-1-A-R-Rahman-Aastha-Gill-Abhijeet-Bhattacharya-Aditi-Singh-Sharma-Adnan-Sami--1761920689643_1761920689643.txt", "utf-8");

const lines = singersText.split('\n');
const allSingers: string[] = [];
const duplicateMarkers = ['(duplicate', 'duplicate –', 'duplicate)', '(duplicate)'];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('List ')) continue;
  
  const isDuplicate = duplicateMarkers.some(marker => 
    trimmed.toLowerCase().includes(marker.toLowerCase())
  );
  
  if (!isDuplicate) {
    allSingers.push(trimmed);
  }
}

const uniqueSingers = [...new Set(allSingers)];

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    
    const existingCelebrities = await CelebrityModel.find({ category: "singer" });
    const existingNames = new Set(
      existingCelebrities.map(c => c.name.toLowerCase().trim())
    );
    
    const missingSingers = uniqueSingers.filter(singer => 
      !existingNames.has(singer.toLowerCase().trim())
    );
    
    console.log(`Total singers in your list: ${uniqueSingers.length}`);
    console.log(`Total singers in database: ${existingCelebrities.length}`);
    console.log(`Missing singers: ${missingSingers.length}`);
    
    if (missingSingers.length > 0) {
      console.log("\nStill missing:");
      missingSingers.forEach(s => console.log(`  - ${s}`));
    } else {
      console.log("\n✓ All singers from your list are now in the database!");
    }
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

main();
