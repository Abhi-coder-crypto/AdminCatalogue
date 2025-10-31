import { CelebrityModel } from "./server/models/celebrity";
import { initializeMongoDB } from "./server/mongodb";

async function removeVideoUrls() {
  try {
    console.log("Removing video URLs from all celebrities...\n");
    
    await initializeMongoDB();
    
    // Update all celebrities and remove the videoUrl field
    const result = await CelebrityModel.updateMany(
      {},
      { $unset: { videoUrl: "" } }
    );
    
    console.log(`✓ Removed video URLs from ${result.modifiedCount} celebrities.`);
    
    // Verify
    const count = await CelebrityModel.countDocuments({ videoUrl: { $exists: true } });
    console.log(`Verification: ${count} celebrities still have videoUrl field.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error removing video URLs:", error);
    process.exit(1);
  }
}

removeVideoUrls();
