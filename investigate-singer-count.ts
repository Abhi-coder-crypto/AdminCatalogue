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
    
    // Check all variations of singer categories
    const variations = [
      "Singers",
      "singers",
      "Singer", 
      "singer",
      "SINGERS"
    ];
    
    console.log("=== CHECKING ALL CATEGORY VARIATIONS ===\n");
    
    let totalFound = 0;
    for (const category of variations) {
      const count = await CelebrityModel.countDocuments({ category });
      if (count > 0) {
        console.log(`Category "${category}": ${count} entries`);
        totalFound += count;
      }
    }
    
    console.log(`\nTotal across all variations: ${totalFound}`);
    
    // Get all unique categories that contain "sing" (case insensitive)
    const allCelebrities = await CelebrityModel.find({});
    const categoriesWithSing = new Set<string>();
    
    allCelebrities.forEach(celeb => {
      if (celeb.category.toLowerCase().includes('sing')) {
        categoriesWithSing.add(celeb.category);
      }
    });
    
    if (categoriesWithSing.size > 0) {
      console.log("\n=== ALL CATEGORIES CONTAINING 'SING' ===");
      categoriesWithSing.forEach(cat => {
        const count = allCelebrities.filter(c => c.category === cat).length;
        console.log(`"${cat}": ${count} entries`);
      });
    }
    
    // Check for duplicates by name
    console.log("\n=== CHECKING FOR DUPLICATE NAMES ===\n");
    
    const singers = await CelebrityModel.find({ category: "Singers" });
    const nameMap = new Map<string, number>();
    
    singers.forEach(singer => {
      const lowerName = singer.name.toLowerCase();
      nameMap.set(lowerName, (nameMap.get(lowerName) || 0) + 1);
    });
    
    const duplicateNames = Array.from(nameMap.entries()).filter(([_, count]) => count > 1);
    
    if (duplicateNames.length > 0) {
      console.log(`Found ${duplicateNames.length} duplicate names:`);
      duplicateNames.forEach(([name, count]) => {
        console.log(`  - "${name}": ${count} entries`);
        const dupes = singers.filter(s => s.name.toLowerCase() === name);
        dupes.forEach(d => console.log(`    ID: ${d._id}, Slug: ${d.slug}`));
      });
    } else {
      console.log("No duplicate names found");
    }
    
    // Final summary
    console.log("\n=== SUMMARY ===");
    console.log(`Total celebrities in database: ${allCelebrities.length}`);
    console.log(`Singers (capitalized): ${singers.length}`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
