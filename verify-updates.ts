import { CelebrityModel } from "./server/models/celebrity";
import { initializeMongoDB } from "./server/mongodb";

async function verifySocialLinks() {
  try {
    await initializeMongoDB();
    
    // Check a few specific celebrities
    const testCelebrities = [
      "Lisa Mishra",
      "Divyakumar",
      "Mohammed Irfan",
      "Udit Narayan",
      "Nakash Aziz",
      "Arijit Singh" // One that wasn't in our update list
    ];
    
    console.log("Verifying social links for sample celebrities:\n");
    
    for (const name of testCelebrities) {
      const celebrity = await CelebrityModel.findOne({ name });
      if (celebrity) {
        console.log(`${celebrity.name}:`);
        console.log(`  Social Links: ${celebrity.socialLinks.join(", ") || "None"}`);
        
        // Check for Twitter/Facebook
        const hasTwitterOrFacebook = celebrity.socialLinks.some(link => 
          link.toLowerCase().includes('twitter.com') || 
          link.toLowerCase().includes('facebook.com') ||
          link.toLowerCase().includes('x.com')
        );
        
        if (hasTwitterOrFacebook) {
          console.log(`  ⚠️  WARNING: Still has Twitter/Facebook links!`);
        } else {
          console.log(`  ✓ No Twitter/Facebook links`);
        }
        console.log();
      }
    }
    
    // Count total celebrities with Twitter/Facebook
    const allCelebrities = await CelebrityModel.find({});
    let withTwitterFacebook = 0;
    
    for (const celeb of allCelebrities) {
      const hasTwitterOrFacebook = celeb.socialLinks.some(link => 
        link.toLowerCase().includes('twitter.com') || 
        link.toLowerCase().includes('facebook.com') ||
        link.toLowerCase().includes('x.com')
      );
      if (hasTwitterOrFacebook) {
        withTwitterFacebook++;
      }
    }
    
    console.log(`Summary:`);
    console.log(`Total celebrities: ${allCelebrities.length}`);
    console.log(`With Twitter/Facebook: ${withTwitterFacebook}`);
    console.log(`Without Twitter/Facebook: ${allCelebrities.length - withTwitterFacebook}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

verifySocialLinks();
