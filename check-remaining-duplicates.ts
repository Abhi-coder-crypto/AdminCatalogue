import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

// More aggressive name normalization for catching spelling variations
function similarityScore(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z]/g, '');
  
  if (s1 === s2) return 1.0;
  
  // Calculate Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

function hasProperDetails(celeb: any): number {
  let score = 0;
  const hasInstagram = celeb.socialLinks?.some((link: string) => 
    link.toLowerCase().includes('instagram.com')
  );
  if (hasInstagram) score += 10;
  if (celeb.image && celeb.image.includes('http')) score += 5;
  if (celeb.location && celeb.location !== 'India') score += 3;
  if (celeb.bio && celeb.bio.length > 50) score += 3;
  if (celeb.socialLinks && celeb.socialLinks.length > 0) score += 2;
  if (celeb.achievements && celeb.achievements.length > 0) score += 2;
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
    
    const singers = await CelebrityModel.find({ category: "Singers" });
    console.log(`Checking ${singers.length} singers for similar names...\n`);
    
    const potentialDuplicates: Array<{names: any[], similarity: number}> = [];
    
    // Check each pair for similarity
    for (let i = 0; i < singers.length; i++) {
      for (let j = i + 1; j < singers.length; j++) {
        const similarity = similarityScore(singers[i].name, singers[j].name);
        
        // If names are 85% similar or more, flag as potential duplicate
        if (similarity >= 0.85) {
          potentialDuplicates.push({
            names: [singers[i], singers[j]],
            similarity
          });
        }
      }
    }
    
    console.log(`Found ${potentialDuplicates.length} potential duplicate pairs:\n`);
    
    const toRemove: any[] = [];
    
    for (const dup of potentialDuplicates) {
      const [celeb1, celeb2] = dup.names;
      const score1 = hasProperDetails(celeb1);
      const score2 = hasProperDetails(celeb2);
      
      console.log(`\n=== Similar Names (${(dup.similarity * 100).toFixed(1)}% match) ===`);
      console.log(`1. ${celeb1.name}`);
      console.log(`   Score: ${score1}, Instagram: ${celeb1.socialLinks?.find((l: string) => l.includes('instagram')) || 'None'}`);
      console.log(`   Location: ${celeb1.location}, Bio length: ${celeb1.bio?.length || 0}`);
      
      console.log(`2. ${celeb2.name}`);
      console.log(`   Score: ${score2}, Instagram: ${celeb2.socialLinks?.find((l: string) => l.includes('instagram')) || 'None'}`);
      console.log(`   Location: ${celeb2.location}, Bio length: ${celeb2.bio?.length || 0}`);
      
      if (score1 > score2) {
        console.log(`   → KEEP: ${celeb1.name}, REMOVE: ${celeb2.name}`);
        toRemove.push(celeb2);
      } else if (score2 > score1) {
        console.log(`   → KEEP: ${celeb2.name}, REMOVE: ${celeb1.name}`);
        toRemove.push(celeb1);
      } else {
        console.log(`   → EQUAL SCORES - Manual review needed`);
      }
    }
    
    if (toRemove.length > 0) {
      console.log(`\n\n=== REMOVING ${toRemove.length} DUPLICATES ===\n`);
      
      for (const celeb of toRemove) {
        await CelebrityModel.deleteOne({ _id: celeb._id });
        console.log(`  ✓ Removed: ${celeb.name} (ID: ${celeb._id})`);
      }
      
      const finalCount = await CelebrityModel.countDocuments({ category: "Singers" });
      console.log(`\n✓ Done! Singers count: ${singers.length} → ${finalCount}`);
    } else {
      console.log("\nNo duplicates found!");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
