import { readFileSync } from "fs";
import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

const singersText = readFileSync("attached_assets/Pasted-List-1-A-R-Rahman-Aastha-Gill-Abhijeet-Bhattacharya-Aditi-Singh-Sharma-Adnan-Sami--1761921747653_1761921747654.txt", "utf-8");

const lines = singersText.split('\n');
const allSingers: string[] = [];
const duplicateMarkers = ['(duplicate', 'duplicate –', 'duplicate)', '(duplicate)'];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('List ')) continue;
  const isDuplicate = duplicateMarkers.some(marker => trimmed.toLowerCase().includes(marker.toLowerCase()));
  if (!isDuplicate) allSingers.push(trimmed);
}

const uniqueSingers = [...new Set(allSingers)];

async function main() {
  const config = loadCelebrityMongoConfig();
  const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
  await connectToCelebrityMongoDB(mongoUri);
  
  const existingCelebrities = await CelebrityModel.find({ 
    category: { $in: ["singer", "Singers", "Singer"] }
  });
  
  const existingNamesMap = new Map(
    existingCelebrities.map(c => [c.name.toLowerCase().trim(), c.name])
  );
  
  const missingSingers: string[] = [];
  const foundSingers: Array<{listName: string, dbName: string}> = [];
  
  for (const singer of uniqueSingers) {
    const normalized = singer.toLowerCase().trim();
    // Check exact match first
    if (existingNamesMap.has(normalized)) {
      foundSingers.push({listName: singer, dbName: existingNamesMap.get(normalized)!});
    } else {
      // Check if it's "Hari Sukhmani" vs "Hari & Sukhmani"
      const found = existingCelebrities.find(c => 
        c.name.toLowerCase().replace(/[&\s-]/g, '') === normalized.replace(/[&\s-]/g, '')
      );
      if (found) {
        foundSingers.push({listName: singer, dbName: found.name});
      } else {
        missingSingers.push(singer);
      }
    }
  }
  
  console.log(`Total singers in your list: ${uniqueSingers.length}`);
  console.log(`Total singers in database: ${existingCelebrities.length}`);
  console.log(`Matched: ${foundSingers.length}`);
  console.log(`Missing: ${missingSingers.length}`);
  
  if (missingSingers.length > 0) {
    console.log("\nStill missing:");
    missingSingers.forEach(s => console.log(`  - ${s}`));
  } else {
    console.log("\n✓ ALL SINGERS FROM YOUR LIST ARE IN THE DATABASE!");
  }
  
  await mongoose.connection.close();
}

main();
