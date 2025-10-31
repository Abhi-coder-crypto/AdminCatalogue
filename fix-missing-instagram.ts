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
    
    // Find Danish
    const danish = await CelebrityModel.findOne({ 
      $or: [
        { name: /Danish/i },
        { slug: /danish/i }
      ]
    });
    
    if (danish) {
      console.log(`Found: ${danish.name}`);
      const hasInstagram = danish.socialLinks?.some((link: string) => 
        link.toLowerCase().includes('instagram')
      );
      
      if (!hasInstagram) {
        danish.socialLinks.push("https://www.instagram.com/jaitlydanishofficial");
        await danish.save();
        console.log(`  ✓ Added Instagram link to ${danish.name}`);
      } else {
        console.log(`  - Already has Instagram: ${danish.socialLinks.find((l: string) => l.includes('instagram'))}`);
      }
    }
    
    // Find Sayli
    const sayli = await CelebrityModel.findOne({ 
      $or: [
        { name: /Sayli/i },
        { slug: /sayli/i }
      ]
    });
    
    if (sayli) {
      console.log(`Found: ${sayli.name}`);
      const hasInstagram = sayli.socialLinks?.some((link: string) => 
        link.toLowerCase().includes('instagram')
      );
      
      if (!hasInstagram) {
        sayli.socialLinks.push("https://www.instagram.com/saylikamble_music");
        await sayli.save();
        console.log(`  ✓ Added Instagram link to ${sayli.name}`);
      } else {
        console.log(`  - Already has Instagram: ${sayli.socialLinks.find((l: string) => l.includes('instagram'))}`);
      }
    }
    
    console.log("\n✓ Done!");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

main();
