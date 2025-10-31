import { CelebrityModel } from "./server/models/celebrity";
import { initializeMongoDB } from "./server/mongodb";

// New singers with complete Instagram information
const newSingers = [
  {
    name: "Farhan Akhtar",
    slug: "farhan-akhtar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Farhan+Akhtar",
    bio: "Indian actor, director, and singer known for his powerful vocals.",
    achievements: ["Playback Singer", "Actor", "Director"],
    socialLinks: ["https://www.instagram.com/faroutakhtar"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Sukriti & Prakriti Kakkar",
    slug: "sukriti-prakriti-kakkar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Sukriti+Prakriti",
    bio: "Twin sister duo known for their melodious voices and Bollywood playback singing.",
    achievements: ["Bollywood Playback Singers"],
    socialLinks: ["https://www.instagram.com/sukriti_prakriti_official"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Stebin Ben",
    slug: "stebin-ben",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Stebin+Ben",
    bio: "Indian playback singer and performer known for his soulful voice.",
    achievements: ["Playback Singer"],
    socialLinks: ["https://www.instagram.com/stebinben"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Badshah",
    slug: "badshah",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Badshah",
    bio: "India's leading rapper and music producer known for chart-topping hits.",
    achievements: ["Rapper", "Music Producer"],
    socialLinks: ["https://www.instagram.com/badboyshah"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Sunidhi Chauhan",
    slug: "sunidhi-chauhan",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Sunidhi+Chauhan",
    bio: "Renowned Indian playback singer with a powerful voice.",
    achievements: ["Filmfare Award Winner", "Playback Singer"],
    socialLinks: ["https://www.instagram.com/sunidhichauhan5"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Rupali Jagga",
    slug: "rupali-jagga",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Rupali+Jagga",
    bio: "Singer known as 'The Shakira of India', winner of Sa Re Ga Ma Pa.",
    achievements: ["Sa Re Ga Ma Pa Winner"],
    socialLinks: ["https://www.instagram.com/rupalijagga"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Raftaar",
    slug: "raftaar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Raftaar",
    bio: "Indian rapper, lyricist, and founder of KALAMKAAR record label.",
    achievements: ["Rapper", "KALAMKAAR Founder"],
    socialLinks: ["https://www.instagram.com/raftaarmusic"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Sona Mohapatra",
    slug: "sona-mohapatra",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Sona+Mohapatra",
    bio: "Indian singer, music composer, and lyricist.",
    achievements: ["Playback Singer", "Composer"],
    socialLinks: ["https://www.instagram.com/sonamohapatra"],
    gender: "Female" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Shalmali Kholgade",
    slug: "shalmali-kholgade",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Shalmali+Kholgade",
    bio: "Filmfare Award-winning playback singer.",
    achievements: ["Filmfare Award Winner"],
    socialLinks: ["https://www.instagram.com/shalmiaow"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Marathi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Shilpa Rao",
    slug: "shilpa-rao",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Shilpa+Rao",
    bio: "Grammy-nominated playback singer.",
    achievements: ["Grammy Nominated", "Filmfare Award Winner"],
    socialLinks: ["https://www.instagram.com/shilparao"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Telugu" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Meet Brothers",
    slug: "meet-brothers",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Meet+Brothers",
    bio: "Music director duo known for Bollywood hits.",
    achievements: ["Music Directors", "Composers"],
    socialLinks: ["https://www.instagram.com/meetbrosofficial"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Meiyang Chang",
    slug: "meiyang-chang",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Meiyang+Chang",
    bio: "Actor, television host, and singer.",
    achievements: ["Indian Idol Finalist", "Actor"],
    socialLinks: ["https://www.instagram.com/meiyangchang"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Rekha Bhardwaj",
    slug: "rekha-bhardwaj",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Rekha+Bhardwaj",
    bio: "Acclaimed playback singer.",
    achievements: ["National Award Winner", "Filmfare Award Winner"],
    socialLinks: ["https://www.instagram.com/rekha_bhardwaj"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Urdu" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Hari & Sukhmani",
    slug: "hari-sukhmani",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Hari+Sukhmani",
    bio: "Folktronic duo fusing traditional Punjabi folk music with electronic music.",
    achievements: ["Folktronic Artists"],
    socialLinks: ["https://www.instagram.com/harisukhmani"],
    gender: "Other" as const,
    language: ["Punjabi" as const, "Hindi" as const],
    location: "Chandigarh",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Hariharan",
    slug: "hariharan",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Hariharan",
    bio: "Legendary playback singer, Padma Shri awardee.",
    achievements: ["Padma Shri", "National Award Winner"],
    socialLinks: ["https://www.instagram.com/singerhariharana"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Tamil" as const],
    location: "Chennai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Salim-Sulaiman",
    slug: "salim-sulaiman",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Salim+Sulaiman",
    bio: "Music composer duo known for Bollywood hits.",
    achievements: ["Music Composers"],
    socialLinks: ["https://www.instagram.com/salimsulaimanmusic"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Vishal Dadlani",
    slug: "vishal-dadlani",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Vishal+Dadlani",
    bio: "Singer and music composer, one half of Vishal-Shekhar.",
    achievements: ["Music Composer", "Singer"],
    socialLinks: ["https://www.instagram.com/vishaldadlani"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Shekhar Ravjiani",
    slug: "shekhar-ravjiani",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Shekhar+Ravjiani",
    bio: "Singer and composer, one half of Vishal-Shekhar.",
    achievements: ["Music Composer", "Singer"],
    socialLinks: ["https://www.instagram.com/shekharravjiani"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Vishal Bhardwaj",
    slug: "vishal-bhardwaj",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Vishal+Bhardwaj",
    bio: "Filmmaker and music composer.",
    achievements: ["Filmmaker", "Music Composer"],
    socialLinks: ["https://www.instagram.com/vishalrbhardwaj"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Urdu" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Divine",
    slug: "divine",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Divine",
    bio: "Pioneer of Indian hip-hop.",
    achievements: ["Rapper", "Gully Gang Founder"],
    socialLinks: ["https://www.instagram.com/vivianakadivine"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "King",
    slug: "king",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=King",
    bio: "Indian rapper known for 'Maan Meri Jaan'.",
    achievements: ["Rapper", "MTV Hustle Finalist"],
    socialLinks: ["https://www.instagram.com/ifeelking"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Delhi",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Anuv Jain",
    slug: "anuv-jain",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Anuv+Jain",
    bio: "Indie singer-songwriter.",
    achievements: ["Singer-Songwriter"],
    socialLinks: ["https://www.instagram.com/anuvjain"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Ludhiana",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Lost Stories",
    slug: "lost-stories",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Lost+Stories",
    bio: "Indian DJ and music production duo.",
    achievements: ["DJ Duo"],
    socialLinks: ["https://www.instagram.com/loststories"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "MC Stan",
    slug: "mc-stan",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=MC+Stan",
    bio: "Indian rapper and Bigg Boss 16 winner.",
    achievements: ["Rapper", "Bigg Boss Winner"],
    socialLinks: ["https://www.instagram.com/m___c___stan"],
    gender: "Male" as const,
    language: ["Hindi" as const],
    location: "Pune",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Raja Kumari",
    slug: "raja-kumari",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Raja+Kumari",
    bio: "American rapper and songwriter.",
    achievements: ["Rapper", "American Music Award Winner"],
    socialLinks: ["https://www.instagram.com/therajakumari"],
    gender: "Female" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Los Angeles",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Zaeden",
    slug: "zaeden",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Zaeden",
    bio: "Indian singer-songwriter and record producer.",
    achievements: ["Singer-Songwriter", "Record Producer"],
    socialLinks: ["https://www.instagram.com/zaeden"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Akasa Singh",
    slug: "akasa-singh",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Akasa+Singh",
    bio: "Indian pop singer known for 'Naagin' and 'Thug Ranjha'.",
    achievements: ["Pop Singer"],
    socialLinks: ["https://www.instagram.com/akasasing"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Jasleen Royal",
    slug: "jasleen-royal",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Jasleen+Royal",
    bio: "Singer-songwriter and music composer.",
    achievements: ["Filmfare Award Winner"],
    socialLinks: ["https://www.instagram.com/jasleenroyal"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Aditya Gadhvi",
    slug: "aditya-gadhvi",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Aditya+Gadhvi",
    bio: "Gujarati folk singer known for 'Khalasi'.",
    achievements: ["Folk Singer"],
    socialLinks: ["https://www.instagram.com/adityagadhviofficial"],
    gender: "Male" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Kinjal Dave",
    slug: "kinjal-dave",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Kinjal+Dave",
    bio: "Gujarati folk and garba singer, known as 'Garba Queen'.",
    achievements: ["Garba Queen"],
    socialLinks: ["https://www.instagram.com/thekinjaldave"],
    gender: "Female" as const,
    language: ["Gujarati" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Aishwarya Majmudar",
    slug: "aishwarya-majmudar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Aishwarya+Majmudar",
    bio: "Indian playback singer and Voice of India winner.",
    achievements: ["Voice of India Winner"],
    socialLinks: ["https://www.instagram.com/aishwarya_tm"],
    gender: "Female" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Bhoomi Trivedi",
    slug: "bhoomi-trivedi",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Bhoomi+Trivedi",
    bio: "Playback singer known for 'Ram Chahe Leela'.",
    achievements: ["Playback Singer"],
    socialLinks: ["https://www.instagram.com/bhoomitrivediofficial"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Gujarati" as const],
    location: "Vadodara",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Mika Singh",
    slug: "mika-singh-official",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Mika+Singh",
    bio: "Popular singer known for 'Bas Ek King' and 'Mauja Hi Mauja'.",
    achievements: ["Singer", "Composer"],
    socialLinks: ["https://www.instagram.com/mikasingh"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Papon",
    slug: "papon",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Papon",
    bio: "Playback singer and composer from Assam.",
    achievements: ["Playback Singer", "Composer"],
    socialLinks: ["https://www.instagram.com/paponmusic"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Assamese" as const],
    location: "Guwahati",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Mohit Chauhan",
    slug: "mohit-chauhan",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Mohit+Chauhan",
    bio: "Soulful playback singer known for 'Tum Se Hi' and 'Masakali'.",
    achievements: ["Filmfare Award Winner"],
    socialLinks: ["https://www.instagram.com/mohitchauhanofficial"],
    gender: "Male" as const,
    language: ["Hindi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Prateek Kuhad",
    slug: "prateek-kuhad",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Prateek+Kuhad",
    bio: "Indie singer-songwriter, featured in Barack Obama's playlist.",
    achievements: ["Indie Artist"],
    socialLinks: ["https://www.instagram.com/prateekkuhad"],
    gender: "Male" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Delhi",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Harrdy Sandhu",
    slug: "harrdy-sandhu",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Harrdy+Sandhu",
    bio: "Punjabi singer and actor known for 'Soch' and 'Bijlee Bijlee'.",
    achievements: ["Punjabi Singer", "Actor"],
    socialLinks: ["https://www.instagram.com/harrdysandhu"],
    gender: "Male" as const,
    language: ["Punjabi" as const, "Hindi" as const],
    location: "Punjab",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  }
];

async function addNewSingers() {
  try {
    console.log("Adding new singers to the database...\n");
    
    await initializeMongoDB();
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const singer of newSingers) {
      const existing = await CelebrityModel.findOne({ slug: singer.slug });
      
      if (existing) {
        console.log(`⊗ Skipped (already exists): ${singer.name}`);
        skippedCount++;
        continue;
      }
      
      await CelebrityModel.create(singer);
      console.log(`✓ Added: ${singer.name}`);
      addedCount++;
    }
    
    console.log(`\n✓ Successfully added ${addedCount} new singers.`);
    console.log(`⊗ Skipped ${skippedCount} existing singers.`);
    process.exit(0);
  } catch (error) {
    console.error("Error adding singers:", error);
    process.exit(1);
  }
}

addNewSingers();
