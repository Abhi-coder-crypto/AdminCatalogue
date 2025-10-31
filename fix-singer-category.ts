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
    
    // Get lowercase "singer" entries
    const lowercaseSingerEntries = await CelebrityModel.find({ category: "singer" });
    console.log(`Found ${lowercaseSingerEntries.length} celebrities with category "singer" (lowercase)\n`);
    
    // Get capitalized "Singers" entries
    const capitalizedSingers = await CelebrityModel.find({ category: "Singers" });
    const capitalizedSlugs = new Set(capitalizedSingers.map(s => s.slug));
    
    // Check for duplicates
    const duplicates: any[] = [];
    const unique: any[] = [];
    
    lowercaseSingerEntries.forEach(entry => {
      if (capitalizedSlugs.has(entry.slug)) {
        duplicates.push(entry);
      } else {
        unique.push(entry);
      }
    });
    
    console.log(`=== ANALYSIS ===`);
    console.log(`Duplicates (exist in both "singer" and "Singers"): ${duplicates.length}`);
    console.log(`Unique (only in "singer"): ${unique.length}\n`);
    
    // Remove duplicates
    if (duplicates.length > 0) {
      console.log("=== REMOVING DUPLICATES ===");
      for (const duplicate of duplicates) {
        await CelebrityModel.deleteOne({ _id: duplicate._id });
        console.log(`  ✓ Removed duplicate: ${duplicate.name} (${duplicate.slug})`);
      }
      console.log(`\nRemoved ${duplicates.length} duplicate entries\n`);
    }
    
    // Update unique entries to "Singers"
    if (unique.length > 0) {
      console.log("=== UPDATING UNIQUE ENTRIES ===");
      for (const entry of unique) {
        entry.category = "Singers";
        await entry.save();
        console.log(`  ✓ Updated category: ${entry.name} -> "Singers"`);
      }
      console.log(`\nUpdated ${unique.length} entries to "Singers"\n`);
    }
    
    // Final count
    const finalCount = await CelebrityModel.countDocuments({ category: "Singers" });
    const finalLowercaseCount = await CelebrityModel.countDocuments({ category: "singer" });
    
    console.log("=== FINAL RESULT ===");
    console.log(`Category "Singers": ${finalCount} entries`);
    console.log(`Category "singer": ${finalLowercaseCount} entries`);
    console.log(`\n✓ All singer entries are now in the "Singers" category!`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
