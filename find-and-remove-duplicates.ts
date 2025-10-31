import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

// Function to normalize names for comparison (handles spelling variations)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .trim();
}

// Function to check if a celebrity has proper details
function hasProperDetails(celeb: any): number {
  let score = 0;
  
  // Instagram link in socialLinks
  const hasInstagram = celeb.socialLinks?.some((link: string) => 
    link.toLowerCase().includes('instagram.com')
  );
  if (hasInstagram) score += 10;
  
  // Has profile image
  if (celeb.profileImage) score += 5;
  
  // Has location
  if (celeb.location) score += 3;
  
  // Has description/bio
  if (celeb.description && celeb.description.length > 50) score += 3;
  
  // Has social links (more than 0)
  if (celeb.socialLinks && celeb.socialLinks.length > 0) score += 2;
  
  return score;
}

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database\n");
    
    // Get all singers
    const singers = await CelebrityModel.find({ category: "Singers" });
    console.log(`Analyzing ${singers.length} singers for duplicates...\n`);
    
    // Group by normalized name
    const nameGroups = new Map<string, any[]>();
    
    singers.forEach(singer => {
      const normalized = normalizeName(singer.name);
      if (!nameGroups.has(normalized)) {
        nameGroups.set(normalized, []);
      }
      nameGroups.get(normalized)!.push(singer);
    });
    
    // Find groups with duplicates
    const duplicateGroups = Array.from(nameGroups.entries())
      .filter(([_, celebs]) => celebs.length > 1);
    
    console.log(`Found ${duplicateGroups.length} sets of duplicates:\n`);
    
    let totalToRemove = 0;
    const toRemove: any[] = [];
    
    for (const [normalized, celebs] of duplicateGroups) {
      console.log(`\n=== Duplicate Set: ${celebs[0].name} ===`);
      
      // Score each celebrity
      const scored = celebs.map(celeb => ({
        celeb,
        score: hasProperDetails(celeb)
      }));
      
      // Sort by score (highest first)
      scored.sort((a, b) => b.score - a.score);
      
      // Keep the best one, mark others for removal
      const best = scored[0];
      const duplicates = scored.slice(1);
      
      console.log(`  ✓ KEEP: ${best.celeb.name}`);
      console.log(`    - Score: ${best.score}`);
      console.log(`    - Instagram: ${best.celeb.socialLinks?.find((l: string) => l.includes('instagram')) || 'None'}`);
      console.log(`    - Location: ${best.celeb.location || 'None'}`);
      console.log(`    - Profile Image: ${best.celeb.profileImage ? 'Yes' : 'No'}`);
      
      duplicates.forEach(dup => {
        console.log(`  ✗ REMOVE: ${dup.celeb.name}`);
        console.log(`    - Score: ${dup.score}`);
        console.log(`    - Instagram: ${dup.celeb.socialLinks?.find((l: string) => l.includes('instagram')) || 'None'}`);
        console.log(`    - Location: ${dup.celeb.location || 'None'}`);
        console.log(`    - Profile Image: ${dup.celeb.profileImage ? 'Yes' : 'No'}`);
        toRemove.push(dup.celeb);
        totalToRemove++;
      });
    }
    
    console.log(`\n\n=== SUMMARY ===`);
    console.log(`Total duplicate sets found: ${duplicateGroups.length}`);
    console.log(`Total entries to remove: ${totalToRemove}`);
    
    if (totalToRemove > 0) {
      console.log(`\nRemoving ${totalToRemove} duplicate entries...`);
      
      for (const celeb of toRemove) {
        await CelebrityModel.deleteOne({ _id: celeb._id });
        console.log(`  ✓ Removed: ${celeb.name} (ID: ${celeb._id})`);
      }
      
      const finalCount = await CelebrityModel.countDocuments({ category: "Singers" });
      console.log(`\n✓ Done! Singers count: ${singers.length} → ${finalCount}`);
    } else {
      console.log("\nNo duplicates to remove!");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
