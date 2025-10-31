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
    
    // Find all singers with lowercase category
    const lowercaseSingers = await CelebrityModel.find({ category: "singers" });
    console.log(`Found ${lowercaseSingers.length} celebrities with category "singers" (lowercase)`);
    
    // Find all singers with capitalized category
    const capitalizedSingers = await CelebrityModel.find({ category: "Singers" });
    console.log(`Found ${capitalizedSingers.length} celebrities with category "Singers" (capitalized)`);
    
    console.log(`Total: ${lowercaseSingers.length + capitalizedSingers.length} singer entries\n`);
    
    // Create a map of slugs from capitalized singers
    const capitalizedSlugs = new Set(capitalizedSingers.map(s => s.slug));
    
    // Find duplicates - lowercase entries that have a matching capitalized entry
    const duplicates = lowercaseSingers.filter(s => capitalizedSlugs.has(s.slug));
    console.log(`Found ${duplicates.length} duplicate entries (existing in both "singers" and "Singers")\n`);
    
    if (duplicates.length > 0) {
      console.log("Duplicates to be removed:");
      duplicates.forEach(d => console.log(`  - ${d.name} (${d.slug})`));
      
      console.log("\nRemoving duplicates...");
      
      let removedCount = 0;
      for (const duplicate of duplicates) {
        await CelebrityModel.deleteOne({ _id: duplicate._id });
        console.log(`  ✓ Removed: ${duplicate.name}`);
        removedCount++;
      }
      
      console.log(`\n✓ Removed ${removedCount} duplicate entries`);
    }
    
    // Update remaining lowercase "singers" to "Singers"
    const remainingLowercase = await CelebrityModel.find({ category: "singers" });
    
    if (remainingLowercase.length > 0) {
      console.log(`\nUpdating ${remainingLowercase.length} remaining "singers" to "Singers"...`);
      
      for (const singer of remainingLowercase) {
        singer.category = "Singers";
        await singer.save();
        console.log(`  ✓ Updated: ${singer.name}`);
      }
    }
    
    // Final count
    const finalCount = await CelebrityModel.countDocuments({ category: "Singers" });
    console.log(`\n=== FINAL RESULT ===`);
    console.log(`Total singers in database: ${finalCount}`);
    console.log(`All entries now use category "Singers" (capitalized)`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
