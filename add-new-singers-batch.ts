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

const newSingers = [
  {
    name: "Preety & Pinky",
    slug: createSlug("Preety & Pinky"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    bio: "Preety and Pinky are an Indipop sister duo known as the 'Piya Piya Girls' who fuse Western pop with traditional garba beats. They've been performing for over 20 years and are celebrated Navratri queens with multiple awards.",
    achievements: [
      "Filmfare Best Playback Singer nomination for 'Piya Piya' (2001)",
      "IIFA Award nomination for Best Female Playback (2001)",
      "Best Dandiya Award for 10 consecutive years in Maharashtra",
      "5 successful albums including garba and folk fusion",
      "Playback singing in films like Har Dil Jo Pyaar Karega, Chalte Chalte"
    ],
    socialLinks: ["https://www.instagram.com/preetyandpinky"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "Gujarati", "Marathi", "English"],
    location: "Mumbai, Maharashtra",
    priceRange: "Premium" as const,
    eventTypes: ["Wedding", "Concert", "Private Party"],
    isFeatured: false
  },
  {
    name: "Rishab Sharma",
    slug: createSlug("Rishab Sharma"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    bio: "Rishab Rikhiram Sharma is a New York-based sitarist, composer, and music producer who blends Indian classical traditions with modern electronic and jazz. He's the youngest disciple of Pandit Ravi Shankar and first Indian classical musician to perform at the White House.",
    achievements: [
      "First solo Indian classical musician to perform at the White House (2022)",
      "Youngest disciple of Pandit Ravi Shankar",
      "Performed for 60,000+ live attendees and 500+ million TV viewers",
      "Founded 'Sitar for Mental Health' mental health awareness initiative",
      "First musician to partner with United Nations for mental health (2024)",
      "4+ million followers on Instagram"
    ],
    socialLinks: ["https://www.instagram.com/rishabsmusic"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "English"],
    location: "New York, USA",
    priceRange: "Premium" as const,
    eventTypes: ["Concert", "Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Sharvi Yadav",
    slug: createSlug("Sharvi Yadav"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    bio: "Sharvi Yadav is a versatile Indian playback singer specializing in Soul, RnB, Blues, Jazz, and Gospel. Winner of 'The Stage 2' in 2016, she made her Bollywood debut with the hit song 'Veere' from Veere Di Wedding.",
    achievements: [
      "Winner of The Stage 2 (2016)",
      "Bollywood debut with 'Veere' from Veere Di Wedding (2018)",
      "Voiced Anna in Disney's Frozen 2 Hindi version",
      "Mirchi Music Awards 2022 - Upcoming Female Vocalist",
      "Named one of top 10 emerging female artists by Rolling Stone India",
      "Collaborated with Amit Trivedi, Vishal Mishra, Badshah"
    ],
    socialLinks: ["https://www.instagram.com/sharviyadav"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "English"],
    location: "Mumbai, Maharashtra",
    priceRange: "Premium" as const,
    eventTypes: ["Concert", "Corporate", "Wedding"],
    isFeatured: false
  },
  {
    name: "Harkirat Sangha",
    slug: createSlug("Harkirat Sangha"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    bio: "Harkirat Sangha is a Canada-based Punjabi rapper and singer known for story-driven songs about the international student and immigrant experience. His breakout hit 'Lifestyle' has over 2 million YouTube views.",
    achievements: [
      "Breakout hit 'Lifestyle' with 2+ million YouTube views",
      "Known for authentic portrayal of international student experience",
      "Popular songs include Patti Ton Patiala, Blend, Jutti, Lahore",
      "124K+ Instagram followers",
      "Rising star in Punjabi music scene"
    ],
    socialLinks: ["https://www.instagram.com/iharkiratsangha"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Punjabi", "Hindi", "English"],
    location: "Hamilton, Ontario, Canada",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Concert", "Wedding", "Private Party"],
    isFeatured: false
  },
  {
    name: "Bismil",
    slug: createSlug("Bismil"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    bio: "Bismil (Mohd Asif) is a classically trained Sufi singer who revolutionized the genre with his intimate 'Bismil Ki Mehfil' format. He's performed at Etihad Arena Abu Dhabi and toured internationally with 200,000+ attendees.",
    achievements: [
      "3 India tours with 200,000+ attendees per tour",
      "100+ million views across digital platforms",
      "2 US & Canada tours with Times Square Billboard appearance",
      "Only Indian Sufi singer to perform at Etihad Arena after Arijit Singh",
      "Won GIWA Awards and WeddingSutra Influencer Awards (2023)",
      "Trained by ustads from Moradabad and Delhi Gharana"
    ],
    socialLinks: ["https://www.instagram.com/bismil.live"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "Urdu"],
    location: "Delhi, India",
    priceRange: "Premium" as const,
    eventTypes: ["Concert", "Wedding", "Private Party"],
    isFeatured: true
  },
  {
    name: "Sagar Bhatia",
    slug: createSlug("Sagar Bhatia"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    bio: "Sagar Bhatia (Sagar the Soul) is a qawwali singer and composer specializing in Sufi, classical, and modern fusion. He gained fame from India's Raw Star (Top 6) and made his Bollywood debut with 'Khudaya' in Sarfira (2024).",
    achievements: [
      "India's Raw Star Top 6 contestant (2014)",
      "Bollywood playback debut with 'Khudaya' in Sarfira (2024)",
      "Won Popular Music Maestro of the Year (2023)",
      "Best Live Act on Stage at The Blackswan Awards (2023)",
      "Runs Sagar Bhatia's Riyaaz music academy",
      "Trained over 600 music students"
    ],
    socialLinks: ["https://www.instagram.com/sagarthesoul"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "Punjabi", "Urdu"],
    location: "Delhi, India",
    priceRange: "Premium" as const,
    eventTypes: ["Wedding", "Concert", "Private Party"],
    isFeatured: false
  },
  {
    name: "Kaka",
    slug: createSlug("Kaka"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
    bio: "Kaka (Ravinder Singh) is a Punjabi singer, lyricist, and composer known for his authentic, soulful voice and relatable lyrics. He rose from a PUDA architect to stardom during 2020 lockdown with viral hits like 'Libas' and 'Temporary Pyar'.",
    achievements: [
      "Teeji Seat reached #1 on Top 50 Punjabi Chart",
      "Temporary Pyar #1 on Gaana's Punjabi Most Popular Chart",
      "Libas charted on YouTube's global music chart",
      "Started free library in his village shaped like a violin",
      "Rose to fame during 2020 COVID lockdown",
      "Known for inspirational rags-to-riches story"
    ],
    socialLinks: ["https://www.instagram.com/kaka._.ji"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Punjabi", "Hindi"],
    location: "Chandumajra, Punjab",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Wedding", "Concert", "Private Party"],
    isFeatured: false
  },
  {
    name: "Sunanda Sharma",
    slug: createSlug("Sunanda Sharma"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    bio: "Sunanda Sharma is a Punjabi singer, model, and actress known for her powerful vocals and expressive performances. Her hit 'Jaani Tera Naa' has 334+ million YouTube views. She's also acted in Sajjan Singh Rangroot with Diljit Dosanjh.",
    achievements: [
      "Jaani Tera Naa - 334+ million YouTube views",
      "Patake - 145+ million views",
      "Best Debut Female Vocalist - PTC Punjabi Music Awards",
      "Best Female Act - Brit Asia TV Music Awards (2017)",
      "Bollywood playback for Nawabzaade and Luka Chuppi",
      "Acting debut in Sajjan Singh Rangroot (2018)"
    ],
    socialLinks: ["https://www.instagram.com/sunanda_ss"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Punjabi", "Hindi"],
    location: "Fatehgarh Churian, Punjab",
    priceRange: "Premium" as const,
    eventTypes: ["Wedding", "Concert", "Corporate"],
    isFeatured: true
  },
  {
    name: "Rahul Vaidya",
    slug: createSlug("Rahul Vaidya"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    bio: "Rahul Vaidya is an Indian singer and television personality who rose to fame as the second runner-up of Indian Idol Season 1 (2004). He's won multiple reality shows including Jo Jeeta Wohi Superstar and Music Ka Maha Muqabla.",
    achievements: [
      "Indian Idol Season 1 - Second Runner-up (2004)",
      "Winner of Jo Jeeta Wohi Superstar (2008)",
      "Winner of Music Ka Maha Muqabla (2010)",
      "Bigg Boss 14 - 1st Runner-up (2020)",
      "Released hit album 'Tera Intezaar' (2005)",
      "Trained under Suresh Wadkar and Himanshu Manocha"
    ],
    socialLinks: ["https://www.instagram.com/rahulvaidyarkv"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "English"],
    location: "Mumbai, Maharashtra",
    priceRange: "Premium" as const,
    eventTypes: ["Wedding", "Concert", "Corporate", "Private Party"],
    isFeatured: false
  },
  {
    name: "Shanmukhapriya",
    slug: createSlug("Shanmukhapriya"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    bio: "Shanmukha Priya is a young Indian singer known for her exceptional yodeling prowess and versatility across Carnatic, Jazz, Pop, and Rock. A.R. Rahman called her the 'Jazz star of India'. She won the Golden Mic on Indian Idol 12.",
    achievements: [
      "Called 'Jazz star of India' by A.R. Rahman",
      "Winner of Golden Mic on Indian Idol 12 auditions",
      "Finalist in Sa Re Ga Ma Pa L'il Champs 2017",
      "Known for exceptional yodeling technique",
      "Playback singer for Telugu film Tejam (2010)",
      "Trained in Carnatic, Hindustani, opera, jazz, and yodeling"
    ],
    socialLinks: ["https://www.instagram.com/shanmukhapriya_1925"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "Telugu", "Tamil", "English"],
    location: "Visakhapatnam, Andhra Pradesh",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Concert", "Corporate", "Wedding"],
    isFeatured: false
  },
  {
    name: "Ashish Kulkarni",
    slug: createSlug("Ashish Kulkarni"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    bio: "Ashish Kulkarni is a singer, songwriter, and guitarist from Pune who trained in Hindustani classical music for 10 years. He's known for his original music and was a prominent contestant on Indian Idol Season 12.",
    achievements: [
      "Indian Idol Season 12 prominent contestant",
      "Viral hit 'Pehra' (2017) on YouTube",
      "10 years of Hindustani classical training",
      "Co-founder of music band Raagalogik",
      "Released multiple original songs including Silsila, Nadaniyan, Durr",
      "Performed at Hard Rock Cafe, High Spirits, BlueFrog"
    ],
    socialLinks: ["https://www.instagram.com/ashishkulkarni.music"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "Marathi", "English"],
    location: "Pune, Maharashtra",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Concert", "Corporate", "Wedding"],
    isFeatured: false
  },
  {
    name: "Arunita Kanjilal",
    slug: createSlug("Arunita Kanjilal"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    bio: "Arunita Kanjilal is a classically trained playback singer who won Sa Re Ga Ma Pa Little Champs at age 10 and was first runner-up on Indian Idol 12. At 18, she became the youngest Indian to perform at London's Wembley SSE Arena.",
    achievements: [
      "Winner of Sa Re Ga Ma Pa Little Champs (Zee Bangla, 2013)",
      "Indian Idol 12 - First Runner-up (2021)",
      "Youngest Indian to perform at Wembley SSE Arena, London",
      "Received Golden Ticket and Golden Mike on Indian Idol 12",
      "Collaborated with Himesh Reshammiya on multiple songs",
      "750K+ YouTube subscribers"
    ],
    socialLinks: ["https://www.instagram.com/arunitakanjilal"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "Bengali", "English"],
    location: "Kolkata, West Bengal",
    priceRange: "Premium" as const,
    eventTypes: ["Concert", "Wedding", "Corporate"],
    isFeatured: true
  },
  {
    name: "Danish Jaitly",
    slug: createSlug("Danish Jaitly"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    bio: "Danish Jaitly is an independent singer-songwriter based in Delhi NCR. He's active in the independent music scene and performs live shows across India, building a growing following on digital platforms.",
    achievements: [
      "Independent artist with 27K+ Instagram followers",
      "Active performer in Delhi NCR music scene",
      "Collaborated with Sonu Nigam and Rouble Nagi",
      "Growing presence on Spotify and YouTube",
      "Known for original compositions and live performances"
    ],
    socialLinks: ["https://www.instagram.com/jaitlydanishofficial"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "English"],
    location: "Delhi NCR, India",
    priceRange: "Budget" as const,
    eventTypes: ["Concert", "Private Party"],
    isFeatured: false
  },
  {
    name: "Sawai Bhatt",
    slug: createSlug("Sawai Bhatt"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
    bio: "Sawai Bhatt is a self-taught Rajasthani folk singer who rose from performing puppet shows to national fame on Indian Idol 12. Known for his authentic traditional vocal talent, he mesmerized judges with 'Keshariya Balam Aao Mere Desh'.",
    achievements: [
      "Indian Idol 12 contestant with memorable performances",
      "Self-taught musician with no formal training",
      "Comes from traditional puppeteer family from Rajasthan",
      "Sang for Himesh Reshammiya's album 'Himesh ke Dil Se'",
      "Collaborated with Palak Muchhal",
      "Known for authentic Rajasthani folk singing style"
    ],
    socialLinks: ["https://www.instagram.com/sawai.bhatt"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "Rajasthani"],
    location: "Nagaur, Rajasthan",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Wedding", "Concert", "Cultural"],
    isFeatured: false
  },
  {
    name: "Anjali Gaikwad",
    slug: createSlug("Anjali Gaikwad"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    bio: "Anjali Gaikwad is a classical Indian singer who won Sa Re Ga Ma Pa L'il Champs 2017 at age 11 (joint winner with Shreyan Bhattacharya). Trained by her father since age 4, she's known for versatility across classical, Bollywood, and Lavni.",
    achievements: [
      "Winner of Sa Re Ga Ma Pa L'il Champs 2017 (joint winner)",
      "Winner of Sangeet Samrat 2017 (Zee Yuva)",
      "Indian Idol 12 - Top 8 contestant",
      "Titled 'Classical Singer of India' (2015)",
      "A.R. Rahman publicly praised her talent",
      "Sang 'Mard Maratha' for film Sachin: A Billion Dreams"
    ],
    socialLinks: ["https://www.instagram.com/anjaligaikwadofficial"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "Marathi"],
    location: "Ahmednagar, Maharashtra",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Concert", "Wedding", "Cultural"],
    isFeatured: false
  },
  {
    name: "Sayli Kamble",
    slug: createSlug("Sayli Kamble"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    bio: "Sayli Kamble is a classically trained Marathi and Hindi playback singer who was second runner-up on Indian Idol 12. She received the Golden Mic during auditions and is known for her versatile voice and euphonious singing.",
    achievements: [
      "Indian Idol 12 - 2nd Runner-up (2021)",
      "Received Golden Mic during Indian Idol auditions",
      "Finalist on Amul Voice of India - Mummy Ke Superstars (2009)",
      "Balashree Puraskar award from Maharashtra government (2005)",
      "Trained in Indian classical music under Smt. Vidya Jail",
      "Popular Marathi playback singer and jingle vocalist"
    ],
    socialLinks: ["https://www.instagram.com/saylikamble_music"],
    videoUrl: "",
    gender: "Female" as const,
    language: ["Hindi", "Marathi", "English"],
    location: "Mumbai, Maharashtra",
    priceRange: "Mid-Range" as const,
    eventTypes: ["Concert", "Wedding", "Corporate"],
    isFeatured: false
  },
  {
    name: "Vishal-Shekhar",
    slug: createSlug("Vishal-Shekhar"),
    category: "Singers",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    bio: "Vishal-Shekhar (Vishal Dadlani & Shekhar Ravjiani) is one of Bollywood's most successful music composer duos. With 72 number-one singles and 3+ billion YouTube streams, they've composed for 350+ films and pioneered techno music in Bollywood.",
    achievements: [
      "72 number-one singles and 3+ billion YouTube streams",
      "Composed soundtracks for 350+ films",
      "Won Filmfare RD Burman Award for New Music Talent (2003)",
      "Won Best Composer Award at 2nd Asian Film Awards",
      "Hit albums: Om Shanti Om, Dostana, Sultan, Pathaan, Fighter",
      "Judges on Indian Idol, The Voice India, Sa Re Ga Ma Pa"
    ],
    socialLinks: ["https://www.instagram.com/vishaldadlani"],
    videoUrl: "",
    gender: "Male" as const,
    language: ["Hindi", "English", "Punjabi"],
    location: "Mumbai, Maharashtra",
    priceRange: "Premium" as const,
    eventTypes: ["Concert", "Corporate", "Wedding"],
    isFeatured: true
  }
];

async function main() {
  try {
    // Connect to celebrity database
    const config = loadCelebrityMongoConfig();
    const mongoUri = process.env.CELEBRITY_MONGODB_URI || config?.celebrityMongoUri;
    
    if (!mongoUri) {
      throw new Error("Celebrity MongoDB URI not found. Please configure it first.");
    }
    
    await connectToCelebrityMongoDB(mongoUri);
    console.log("Connected to database");
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const singer of newSingers) {
      try {
        // Check if singer already exists
        const existing = await CelebrityModel.findOne({ slug: singer.slug });
        
        if (existing) {
          console.log(`Skipped: ${singer.name} (already exists)`);
          skippedCount++;
          continue;
        }
        
        // Add the singer
        await CelebrityModel.create(singer);
        console.log(`✓ Added: ${singer.name}`);
        addedCount++;
      } catch (error: any) {
        console.error(`Error adding ${singer.name}:`, error.message);
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Added: ${addedCount} singers`);
    console.log(`Skipped: ${skippedCount} singers (already in database)`);
    console.log(`Total processed: ${newSingers.length} singers`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from database");
  }
}

main();
