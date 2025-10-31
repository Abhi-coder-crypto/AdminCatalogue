import { readFileSync } from "fs";
import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

// Parse the singers list from the attached file
const singersText = readFileSync("attached_assets/Pasted-List-1-A-R-Rahman-Aastha-Gill-Abhijeet-Bhattacharya-Aditi-Singh-Sharma-Adnan-Sami--1761920689643_1761920689643.txt", "utf-8");

// Extract unique singer names
const lines = singersText.split('\n');
const allSingers: string[] = [];
const duplicateMarkers = ['(duplicate', 'duplicate –', 'duplicate)', '(duplicate)'];

for (const line of lines) {
  const trimmed = line.trim();
  
  // Skip empty lines and list headers
  if (!trimmed || trimmed.startsWith('List ')) continue;
  
  // Check if it's marked as duplicate
  const isDuplicate = duplicateMarkers.some(marker => 
    trimmed.toLowerCase().includes(marker.toLowerCase())
  );
  
  if (isDuplicate) {
    console.log(`Skipping duplicate: ${trimmed}`);
    continue;
  }
  
  allSingers.push(trimmed);
}

// Remove actual duplicates from the list
const uniqueSingers = [...new Set(allSingers)];
console.log(`Total unique singers to process: ${uniqueSingers.length}`);

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  try {
    // Connect to celebrity database
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found. Please configure it first.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database");
    
    // Get existing celebrities
    const existingCelebrities = await CelebrityModel.find({ category: "singer" });
    const existingNames = new Set(
      existingCelebrities.map(c => c.name.toLowerCase().trim())
    );
    
    console.log(`\nFound ${existingCelebrities.length} existing singers in database`);
    
    // Find missing singers
    const missingSingers = uniqueSingers.filter(singer => 
      !existingNames.has(singer.toLowerCase().trim())
    );
    
    console.log(`\nMissing singers (${missingSingers.length}):`);
    missingSingers.forEach(singer => console.log(`  - ${singer}`));
    
    if (missingSingers.length === 0) {
      console.log("\nAll singers are already in the database!");
      process.exit(0);
    }
    
    // For now, let's create a list of missing singers
    // We'll need to search for their info and Instagram
    console.log(`\n\nNeed to add ${missingSingers.length} singers`);
    console.log("Singers to search for info:");
    console.log(JSON.stringify(missingSingers, null, 2));
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

main();
