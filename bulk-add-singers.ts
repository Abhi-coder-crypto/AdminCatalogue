import { readFileSync } from "fs";
import mongoose from "mongoose";
import { CelebrityModel } from "./server/models/celebrity";
import { connectToCelebrityMongoDB, loadCelebrityMongoConfig } from "./server/mongodb";

// Instagram handles from web search
const knownInstagramHandles: Record<string, string> = {
  "Arijit Singh": "https://www.instagram.com/arijitsingh/",
  "Neha Kakkar": "https://www.instagram.com/nehakakkar/",
  "Shreya Ghoshal": "https://www.instagram.com/shreyaghoshal/",
  "A R. Rahman": "https://www.instagram.com/arrahman/",
  "Sonu Nigam": "https://www.instagram.com/sonunigamofficial/",
  "Badshah": "https://www.instagram.com/badboyshah/",
  "Honey Singh": "https://www.instagram.com/yoyohoneysingh/",
  "Guru Randhawa": "https://www.instagram.com/gururandhawa/",
  "Diljit Dosanjh": "https://www.instagram.com/diljitdosanjh/",
  "Atif Aslam": "https://www.instagram.com/atifaslam/",
  "Armaan Malik": "https://www.instagram.com/armaanmalik/",
  "Jubin Nautiyal": "https://www.instagram.com/jubin_nautiyal/",
  "Darshan Raval": "https://www.instagram.com/darshanravaldz/",
  "Sonu Kakkar": "https://www.instagram.com/sonukakkarofficial/",
  "Tony Kakkar": "https://www.instagram.com/tonykakkar/",
  "Sunidhi Chauhan": "https://www.instagram.com/sunidhichauhan5/",
  "Shaan": "https://www.instagram.com/singer_shaan/",
  "Kumar Sanu": "https://www.instagram.com/kumarsanuofficial/",
  "Alka Yagnik": "https://www.instagram.com/alkayagnik_official/",
  "Udit Narayan": "https://www.instagram.com/uditnarayan.jha/",
  "Anu Malik": "https://www.instagram.com/anu_malik/",
  "Himesh Reshammiya": "https://www.instagram.com/himeshreshammiya/",
  "Mika Singh": "https://www.instagram.com/mikasingh/",
  "Palak Mucchal": "https://www.instagram.com/palakmuchhal/",
  "Jonita Gandhi": "https://www.instagram.com/jonitagandhi/",
  "Kanika Kapoor": "https://www.instagram.com/kanikakaporofficial/",
  "Harshdeep Kaur": "https://www.instagram.com/harshdeepkaurmusic/",
  "Harrdy Sandhu": "https://www.instagram.com/harrdysandhu/",
  "Jasleen Royal": "https://www.instagram.com/jasleenroyal/",
  "Dhvani Bhanushali": "https://www.instagram.com/dhvanibhanushali22/",
  "Asees Kaur": "https://www.instagram.com/aseeskaurmusic/",
  "Benny Dayal": "https://www.instagram.com/bennydayal/",
  "Vishal Mishra": "https://www.instagram.com/vishal_mishra_official/",
  "Shilpa Rao": "https://www.instagram.com/shilparao/",
  "Amit Trivedi": "https://www.instagram.com/itsamittrivedi/",
  "Shankar Mahadevan": "https://www.instagram.com/shankarmahadevan123/",
  "Mohit Chauhan": "https://www.instagram.com/mohitchauhanofficial/",
  "Papon": "https://www.instagram.com/paponmusic/",
  "Karan Aujla": "https://www.instagram.com/karanaujla/",
  "A.P. Dhillon": "https://www.instagram.com/apdhillon/",
  "Divine (Rapper)": "https://www.instagram.com/vivianakadivine/",
  "King (Singer)": "https://www.instagram.com/iamkingvivian/",
  "Prateek Kuhad": "https://www.instagram.com/prateekkuhad/",
  "Anuv Jain": "https://www.instagram.com/anuvjain/",
  "Raftaar": "https://www.instagram.com/raftaarmusic/",
  "MC Stan (Rapper)": "https://www.instagram.com/m.c.stan/",
  "Daler Mehndi": "https://www.instagram.com/dalermehndi/",
  "Yohani": "https://www.instagram.com/yohanimusic/",
  "Rohanpreet Singh": "https://www.instagram.com/rohanpreetsingh/",
  "Raja Kumari": "https://www.instagram.com/rajakumari/",
  "Aditya Gadhvi": "https://www.instagram.com/adityagadhviofficial/",
  "Ayushmann Khurana": "https://www.instagram.com/ayushmannk/",
  "Farhan Akhtar": "https://www.instagram.com/faroutakhtar/",
};

// Singer biographical information
const singerBios: Record<string, string> = {
  "Arijit Singh": "Arijit Singh is one of India's most celebrated playback singers, known for his soulful and versatile voice. He has won multiple Filmfare Awards and is regarded as one of the best vocalists in contemporary Bollywood music.",
  "Neha Kakkar": "Neha Kakkar is a popular Indian playback singer who rose to fame through singing reality shows. She is known for her energetic performances and versatile singing style, making her one of the most sought-after singers in Bollywood.",
  "Shreya Ghoshal": "Shreya Ghoshal is an acclaimed Indian playback singer with numerous National Film Awards and Filmfare Awards. Her melodious voice has made her one of the most successful and prolific singers in Indian cinema.",
  "A R. Rahman": "A.R. Rahman is an Oscar-winning music composer and singer, known as the 'Mozart of Madras'. He has revolutionized Indian film music and won international acclaim for his work.",
  "Sonu Nigam": "Sonu Nigam is a legendary Indian playback singer known for his versatility across various genres. He has sung in multiple languages and won numerous awards for his exceptional vocal abilities.",
  "Badshah": "Badshah is a popular Indian rapper and music producer known for his catchy rap songs and party numbers. He has become one of the most successful artists in the Indian music industry.",
  "Honey Singh": "Yo Yo Honey Singh is a renowned Indian rapper, music producer, and actor. He is credited with popularizing Punjabi rap music in India and has delivered numerous chartbusting hits.",
  "Guru Randhawa": "Guru Randhawa is a popular Indian singer and songwriter known for his Punjabi pop songs. His energetic tracks have made him one of the most streamed Indian artists globally.",
  "Diljit Dosanjh": "Diljit Dosanjh is a multi-talented singer, actor, and songwriter from Punjab. He has achieved massive success in both Punjabi and Bollywood music industries.",
};

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Parse the singers list
const singersText = readFileSync("attached_assets/Pasted-List-1-A-R-Rahman-Aastha-Gill-Abhijeet-Bhattacharya-Aditi-Singh-Sharma-Adnan-Sami--1761920689643_1761920689643.txt", "utf-8");
const lines = singersText.split('\n');
const allSingers: string[] = [];
const duplicateMarkers = ['(duplicate', 'duplicate –', 'duplicate)', '(duplicate)'];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('List ')) continue;
  
  const isDuplicate = duplicateMarkers.some(marker => 
    trimmed.toLowerCase().includes(marker.toLowerCase())
  );
  
  if (!isDuplicate) {
    allSingers.push(trimmed);
  }
}

const uniqueSingers = [...new Set(allSingers)];

async function main() {
  try {
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database\n");
    
    // Get existing celebrities
    const existingCelebrities = await CelebrityModel.find({ category: "singer" });
    const existingNames = new Set(
      existingCelebrities.map(c => c.name.toLowerCase().trim())
    );
    
    const missingSingers = uniqueSingers.filter(singer => 
      !existingNames.has(singer.toLowerCase().trim())
    );
    
    console.log(`Adding ${missingSingers.length} singers to database...\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const singerName of missingSingers) {
      try {
        const slug = createSlug(singerName);
        const instagramUrl = knownInstagramHandles[singerName] || "";
        const bio = singerBios[singerName] || `${singerName} is a talented Indian singer known for contributions to the music industry.`;
        
        const socialLinksArray: string[] = instagramUrl ? [instagramUrl] : [];
        
        const celebrityData = {
          name: singerName,
          slug: slug,
          category: "singer" as const,
          image: "https://via.placeholder.com/400x400?text=Singer+Profile",
          bio: bio,
          achievements: [],
          socialLinks: socialLinksArray,
          videoUrl: "",
          gender: "Other" as const,
          language: ["Hindi", "English"],
          location: "India",
          priceRange: undefined,
          eventTypes: ["Concert", "Corporate", "Wedding"],
          isFeatured: false,
        };
        
        const celebrity = new CelebrityModel(celebrityData);
        await celebrity.save();
        
        successCount++;
        console.log(`✓ Added: ${singerName}${instagramUrl ? ' (with Instagram)' : ''}`);
      } catch (error) {
        failCount++;
        console.error(`✗ Failed to add ${singerName}:`, error instanceof Error ? error.message : error);
      }
    }
    
    console.log(`\n====== Summary ======`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${missingSingers.length}`);
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

main();
