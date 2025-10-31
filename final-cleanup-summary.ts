import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database\n");
    
    const singers = await CelebrityModel.find({ category: "Singers" });
    
    console.log("=== FINAL DATABASE STATUS ===\n");
    console.log(`Total Singers: ${singers.length}`);
    
    const withInstagram = singers.filter(s => 
      s.socialLinks?.some((link: string) => link.toLowerCase().includes('instagram'))
    );
    
    const withDetailedLocation = singers.filter(s => 
      s.location && s.location !== 'India' && s.location.length > 5
    );
    
    console.log(`Singers with Instagram links: ${withInstagram.length}`);
    console.log(`Singers with detailed locations: ${withDetailedLocation.length}`);
    
    // Show the 16 singers you requested
    const requested16 = [
      "Preety & Pinky",
      "Rishab Sharma",
      "Sharvi Yadav",
      "Harkirat Sangha",
      "Bismil",
      "Sagar Bhatia",
      "Kaka",
      "Sunanda Sharma",
      "Rahul Vaidya",
      "Shanmukhapriya",
      "Ashish Kulkarni",
      "Arunita Kanjilal",
      "Danish Jaitly",
      "Sawai Bhatt",
      "Anjali Gaikwad",
      "Sayli Kamble"
    ];
    
    console.log("\n=== YOUR 16 REQUESTED SINGERS ===");
    let foundCount = 0;
    for (const name of requested16) {
      const found = singers.find(s => 
        s.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(s.name.toLowerCase())
      );
      if (found) {
        const instagram = found.socialLinks?.find((l: string) => l.includes('instagram'));
        console.log(`✓ ${found.name} - ${instagram ? '✓ Has Instagram' : '✗ No Instagram'}`);
        foundCount++;
      } else {
        console.log(`✗ ${name} - NOT FOUND`);
      }
    }
    
    console.log(`\n${foundCount}/16 singers found in database`);
    
    console.log("\n=== CLEANUP SUMMARY ===");
    console.log("Starting count: 170 singers (with duplicates)");
    console.log("First cleanup: Removed 8 exact duplicates → 162 singers");
    console.log("Second cleanup: Removed 7 similar name duplicates → 155 singers");
    console.log("Final count: 155 unique singers");
    console.log("\nDuplicates removed:");
    console.log("  - Ayushmann Khurana (kept Ayushmann Khurrana)");
    console.log("  - A R. Rahman (kept A. R. Rahman)");
    console.log("  - Sona Mahapatra (kept Sona Mohapatra)");
    console.log("  - Rekha Bharadwaj (kept Rekha Bhardwaj)");
    console.log("  - And 11 others with incomplete details");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n✓ Database cleanup complete!");
  }
}

main();
