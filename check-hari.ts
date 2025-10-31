import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

async function main() {
  const config = loadCelebrityMongoConfig();
  const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
  await connectToCelebrityMongoDB(mongoUri);
  
  const hari = await CelebrityModel.find({ 
    $or: [
      { name: { $regex: /hari/i } },
      { slug: { $regex: /hari/i } }
    ]
  });
  
  console.log(`Found ${hari.length} celebrities with "hari" in name or slug:`);
  hari.forEach(c => console.log(`  - Name: "${c.name}", Slug: "${c.slug}", Category: "${c.category}"`));
  
  await mongoose.connection.close();
}

main();
