import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Singer updates with their Instagram links
const singerUpdates = [
  {
    name: "Sharvi Yadav",
    slug: createSlug("Sharvi Yadav"),
    instagramLink: "https://www.instagram.com/sharviyadav"
  },
  {
    name: "Bismil",
    slug: createSlug("Bismil"),
    instagramLink: "https://www.instagram.com/bismil.live"
  },
  {
    name: "Sagar Bhatia",
    slug: createSlug("Sagar Bhatia"),
    instagramLink: "https://www.instagram.com/sagarthesoul"
  },
  {
    name: "Kaka",
    slug: createSlug("Kaka"),
    instagramLink: "https://www.instagram.com/kaka._.ji"
  },
  {
    name: "Sunanda Sharma",
    slug: createSlug("Sunanda Sharma"),
    instagramLink: "https://www.instagram.com/sunanda_ss"
  },
  {
    name: "Rahul Vaidya",
    slug: createSlug("Rahul Vaidya"),
    instagramLink: "https://www.instagram.com/rahulvaidyarkv"
  },
  {
    name: "Ashish Kulkarni",
    slug: createSlug("Ashish Kulkarni"),
    instagramLink: "https://www.instagram.com/ashishkulkarni.music"
  },
  {
    name: "Arunita Kanjilal",
    slug: createSlug("Arunita Kanjilal"),
    instagramLink: "https://www.instagram.com/arunitakanjilal"
  },
  {
    name: "Sawai Bhatt",
    slug: createSlug("Sawai Bhatt"),
    instagramLink: "https://www.instagram.com/sawai.bhatt"
  },
  {
    name: "Anjali Gaikwad",
    slug: createSlug("Anjali Gaikwad"),
    instagramLink: "https://www.instagram.com/anjaligaikwadofficial"
  }
];

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found. Please configure it first.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database\n");
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const singer of singerUpdates) {
      try {
        const existing = await CelebrityModel.findOne({ slug: singer.slug });
        
        if (!existing) {
          console.log(`❌ Not found: ${singer.name}`);
          notFoundCount++;
          continue;
        }
        
        // Check if Instagram link is already in socialLinks
        const hasInstagram = existing.socialLinks.some(link => 
          link.toLowerCase().includes('instagram.com')
        );
        
        if (hasInstagram) {
          // Update the Instagram link
          const updatedLinks = existing.socialLinks.map(link => 
            link.toLowerCase().includes('instagram.com') ? singer.instagramLink : link
          );
          existing.socialLinks = updatedLinks;
        } else {
          // Add the Instagram link
          existing.socialLinks.push(singer.instagramLink);
        }
        
        await existing.save();
        console.log(`✓ Updated Instagram link for: ${singer.name}`);
        updatedCount++;
      } catch (error: any) {
        console.error(`Error updating ${singer.name}:`, error.message);
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Updated: ${updatedCount} singers`);
    console.log(`Not found: ${notFoundCount} singers`);
    console.log(`Total processed: ${singerUpdates.length} singers`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
