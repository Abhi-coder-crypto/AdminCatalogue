import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

const finalSingers = [
  {
    name: "A R. Rahman",
    slug: "ar-rahman",
    instagram: "https://www.instagram.com/arrahman/",
    bio: "A.R. Rahman is an Oscar-winning music composer and singer, known as the 'Mozart of Madras'. He has revolutionized Indian film music and won international acclaim for his work.",
  },
  {
    name: "Hari Sukhmani",
    slug: "hari-sukhmani",
    instagram: "",
    bio: "Hari Sukhmani is a talented Indian singer known for contributions to the music industry.",
  }
];

async function main() {
  const config = loadCelebrityMongoConfig();
  const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
  await connectToCelebrityMongoDB(mongoUri);
  
  for (const singer of finalSingers) {
    try {
      const socialLinksArray: string[] = singer.instagram ? [singer.instagram] : [];
      
      const celebrityData = {
        name: singer.name,
        slug: singer.slug,
        category: "Singers",
        image: "https://via.placeholder.com/400x400?text=Singer+Profile",
        bio: singer.bio,
        achievements: [],
        socialLinks: socialLinksArray,
        videoUrl: "",
        gender: "Other" as const,
        language: ["Hindi", "English"],
        location: "India",
        eventTypes: ["Concert", "Corporate", "Wedding"],
        isFeatured: false,
      };
      
      const celebrity = new CelebrityModel(celebrityData);
      await celebrity.save();
      
      console.log(`✓ Added: ${singer.name}${singer.instagram ? ' (with Instagram)' : ''}`);
    } catch (error) {
      console.error(`✗ Failed to add ${singer.name}:`, error instanceof Error ? error.message : error);
    }
  }
  
  await mongoose.connection.close();
}

main();
