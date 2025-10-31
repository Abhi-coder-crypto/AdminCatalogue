import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

async function main() {
  const config = loadCelebrityMongoConfig();
  const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
  await connectToCelebrityMongoDB(mongoUri);
  
  const allCelebs = await CelebrityModel.find({});
  console.log(`Total celebrities in database: ${allCelebs.length}`);
  
  const byCategory = allCelebs.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\nBreakdown by category:");
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  const singers = allCelebs.filter(c => c.category.toLowerCase().includes('sing'));
  console.log(`\nSingers (any category with 'sing'): ${singers.length}`);
  
  if (singers.length > 0 && singers.length < 50) {
    console.log("\nFirst 50 singers:");
    singers.slice(0, 50).forEach(s => console.log(`  - ${s.name} (category: ${s.category})`));
  }
  
  await mongoose.connection.close();
}

main();
