import { CelebrityModel } from "./server/models/celebrity";
import { initializeMongoDB } from "./server/mongodb";

// Mapping of singer names to Instagram URLs
const instagramUpdates: Record<string, string> = {
  "lisamishra": "https://www.instagram.com/lisamishramusic",
  "divya kumar": "https://www.instagram.com/aslidivyakumar",
  "sachet parampara": "https://www.instagram.com/sachetparamparaofficial",
  "mohammed irfan": "https://www.instagram.com/mohammedirfanali",
  "laqshya kapoor": "https://www.instagram.com/laqshaykapoor",
  "shashwat": "https://www.instagram.com/shashwatsinghofficial",
  "nakash aziz": "https://www.instagram.com/nakash_aziz",
  "nikita gandhi": "https://www.instagram.com/nikhitagandhiofficial",
  "palak muchhal": "https://www.instagram.com/palakmuchhal3",
  "udit narayan": "https://www.instagram.com/uditnarayanmusic",
  "mahalakshmi iyer": "https://www.instagram.com/mahalakshmiiyermusic",
  "master saleem": "https://www.instagram.com/mastersaleem786official",
  "kavita krishnamurthy": "https://www.instagram.com/kavitaksub",
  "kavita seth": "https://www.instagram.com/sethkavita",
  "javed ali": "https://www.instagram.com/javedali4u",
  "gajendra verma": "https://www.instagram.com/ivermagajendra",
  "falguni pathak": "https://www.instagram.com/falgunipathak12",
  "anushka manchanda": "https://www.instagram.com/anushkadisco",
  "anuradha paudwal": "https://www.instagram.com/paudwal.anuradha_official",
  "ankit tiwari": "https://www.instagram.com/ankittiwari",
  "alisha chinai": "https://www.instagram.com/alishachinaiofficial",
  "amit kumar": "https://www.instagram.com/amitsinhaaofficial",
  "amit mishra": "https://www.instagram.com/amitprakashmishra",
  "amit trivedi": "https://www.instagram.com/itsamittrivedi",
  "akhil sachdeva": "https://www.instagram.com/sachdevaakhilnasha",
  "aditi singh sharma": "https://www.instagram.com/adtsinghsharma",
};

function isTwitterOrFacebook(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('twitter.com') || 
         lowerUrl.includes('x.com') || 
         lowerUrl.includes('facebook.com') ||
         lowerUrl.includes('fb.com');
}

function isInstagram(url: string): boolean {
  return url.toLowerCase().includes('instagram.com');
}

async function updateSocialLinks() {
  try {
    console.log("Starting social links update...");
    
    // Initialize MongoDB connections
    await initializeMongoDB();
    console.log("Database connections initialized");
    
    // Fetch all celebrities
    const celebrities = await CelebrityModel.find({});
    console.log(`Found ${celebrities.length} celebrities`);
    
    let updatedCount = 0;
    
    for (const celebrity of celebrities) {
      let needsUpdate = false;
      let newSocialLinks = celebrity.socialLinks || [];
      
      // Remove Twitter and Facebook links
      const filteredLinks = newSocialLinks.filter(link => !isTwitterOrFacebook(link));
      
      if (filteredLinks.length !== newSocialLinks.length) {
        needsUpdate = true;
        newSocialLinks = filteredLinks;
        console.log(`Removed Twitter/Facebook from: ${celebrity.name}`);
      }
      
      // Check if this celebrity needs Instagram link update
      const normalizedName = celebrity.name.toLowerCase().trim();
      const instagramUrl = instagramUpdates[normalizedName];
      
      if (instagramUrl) {
        // Remove any existing Instagram links
        newSocialLinks = newSocialLinks.filter(link => !isInstagram(link));
        // Add the new Instagram link
        newSocialLinks.push(instagramUrl);
        needsUpdate = true;
        console.log(`Updated Instagram for: ${celebrity.name} -> ${instagramUrl}`);
      }
      
      // Update the celebrity if needed
      if (needsUpdate) {
        celebrity.socialLinks = newSocialLinks;
        await celebrity.save();
        updatedCount++;
      }
    }
    
    console.log(`\nUpdate complete! Updated ${updatedCount} celebrities.`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating social links:", error);
    process.exit(1);
  }
}

// Run the update
updateSocialLinks();
