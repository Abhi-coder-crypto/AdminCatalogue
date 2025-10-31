import { CelebrityModel } from "./server/models/celebrity";
import { initializeMongoDB } from "./server/mongodb";

const moreSingers = [
  {
    name: "Parthiv Gohil",
    slug: "parthiv-gohil",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Parthiv+Gohil",
    bio: "Indian playback singer known for his work in Bollywood and Gujarati films.",
    achievements: ["Sa Re Ga Ma Winner", "Playback Singer"],
    socialLinks: ["https://www.instagram.com/parthivgohil9"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Gujarati" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Kirtidan Gadhvi",
    slug: "kirtidan-gadhvi",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Kirtidan+Gadhvi",
    bio: "Gujarati folk singer known as the 'Dandiya King'.",
    achievements: ["Dandiya King", "MTV Asia Award Winner"],
    socialLinks: ["https://www.instagram.com/kirtidangadhviofficial"],
    gender: "Male" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Jigardan Gadhvi",
    slug: "jigardan-gadhvi",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Jigardan+Gadhvi",
    bio: "Indian playback singer and songwriter known for Gujarati cinema.",
    achievements: ["Playback Singer", "Music Composer"],
    socialLinks: ["https://www.instagram.com/jigrra"],
    gender: "Male" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Ahmedabad",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Geeta Rabari",
    slug: "geeta-rabari",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Geeta+Rabari",
    bio: "Gujarati folk singer known as 'Kutch ni Koyal' (Nightingale of Kutch).",
    achievements: ["Folk Singer", "Viral Sensation"],
    socialLinks: ["https://www.instagram.com/geetabenrabariofficial"],
    gender: "Female" as const,
    language: ["Gujarati" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Keerthy Sagathia",
    slug: "keerthy-sagathia",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Keerthy+Sagathia",
    bio: "Indian playback singer known for Gujarati and Hindi songs.",
    achievements: ["Playback Singer"],
    socialLinks: ["https://www.instagram.com/keerthysagathia"],
    gender: "Male" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Gujarat",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Manasi Parekh",
    slug: "manasi-parekh",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Manasi+Parekh",
    bio: "Indian actress and singer known for Gujarati films and playback singing.",
    achievements: ["Actress", "Playback Singer"],
    socialLinks: ["https://www.instagram.com/manasiparekh"],
    gender: "Female" as const,
    language: ["Gujarati" as const, "Hindi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Pawan Singh",
    slug: "pawan-singh",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Pawan+Singh",
    bio: "Bhojpuri singer and actor known as 'Powerstar', hit song 'Lollypop Lagelu'.",
    achievements: ["Bhojpuri Superstar", "Filmfare Nominee"],
    socialLinks: ["https://www.instagram.com/singhpawan999"],
    gender: "Male" as const,
    language: ["Hindi" as const],
    location: "Bihar",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Khesari Lal Yadav",
    slug: "khesari-lal-yadav",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Khesari+Lal+Yadav",
    bio: "Bhojpuri singer and actor, one of the most popular artists in Bhojpuri cinema.",
    achievements: ["Bhojpuri Singer", "Actor"],
    socialLinks: ["https://www.instagram.com/khesari_yadav"],
    gender: "Male" as const,
    language: ["Hindi" as const],
    location: "Bihar",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Daler Mehndi",
    slug: "daler-mehndi",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Daler+Mehndi",
    bio: "Legendary Indian singer known for Bhangra and pop music, famous for 'Tunak Tunak Tun'.",
    achievements: ["Bhangra Legend", "Pop Singer"],
    socialLinks: ["https://www.instagram.com/thedalermehndiofficial"],
    gender: "Male" as const,
    language: ["Punjabi" as const, "Hindi" as const],
    location: "Delhi",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Yohani",
    slug: "yohani",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Yohani",
    bio: "Sri Lankan singer-songwriter known for viral hit 'Manike Mage Hithe'.",
    achievements: ["Viral Sensation", "Red Bull Records Artist"],
    socialLinks: ["https://www.instagram.com/yohanimusic"],
    gender: "Female" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Colombo",
    eventTypes: ["Concert" as const, "Private Party" as const],
    isFeatured: false
  },
  {
    name: "Rohanpreet Singh",
    slug: "rohanpreet-singh",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Rohanpreet+Singh",
    bio: "Punjabi singer married to Neha Kakkar, known for 'Pehli Mulakat' and 'Hello Hi'.",
    achievements: ["Rising Star Runner-up", "Punjabi Singer"],
    socialLinks: ["https://www.instagram.com/rohanpreetsingh"],
    gender: "Male" as const,
    language: ["Punjabi" as const, "Hindi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Sonu Kakkar",
    slug: "sonu-kakkar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Sonu+Kakkar",
    bio: "Playback singer known for 'Babuji Zaara Dheere Chalo' and 'London Thumakda'.",
    achievements: ["Playback Singer", "Multilingual Singer"],
    socialLinks: ["https://www.instagram.com/sonukakkarofficial"],
    gender: "Female" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Tony Kakkar",
    slug: "tony-kakkar",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Tony+Kakkar",
    bio: "Singer, music composer, and producer known for 'Dheeme Dheeme' and 'Coca Cola Tu'.",
    achievements: ["Singer", "Music Composer", "Desi Music Factory Co-founder"],
    socialLinks: ["https://www.instagram.com/tonykakkar"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Punjabi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Usha Uthup",
    slug: "usha-uthup",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Usha+Uthup",
    bio: "Legendary singer with deep contralto voice, Padma Bhushan awardee.",
    achievements: ["Padma Bhushan", "Padma Shri", "Legendary Singer"],
    socialLinks: ["https://www.instagram.com/singerushauthup"],
    gender: "Female" as const,
    language: ["Hindi" as const, "English" as const],
    location: "Kolkata",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Vishal Mishra",
    slug: "vishal-mishra",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Vishal+Mishra",
    bio: "Music composer and singer known for 'Kaise Hua' from Kabir Singh.",
    achievements: ["Music Composer", "Singer"],
    socialLinks: ["https://www.instagram.com/vishalmishraofficial"],
    gender: "Male" as const,
    language: ["Hindi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Corporate" as const],
    isFeatured: false
  },
  {
    name: "Sukhbir",
    slug: "sukhbir",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Sukhbir",
    bio: "Indian singer, musician, and composer known for Bhangra and pop music.",
    achievements: ["Bhangra Singer", "Composer"],
    socialLinks: ["https://www.instagram.com/sukhbir_singer"],
    gender: "Male" as const,
    language: ["Punjabi" as const, "Hindi" as const],
    location: "Mumbai",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  },
  {
    name: "Salman Ali",
    slug: "salman-ali",
    category: "Singers",
    image: "https://via.placeholder.com/400x400?text=Salman+Ali",
    bio: "Indian Idol Season 10 winner known for playback singing in Bollywood.",
    achievements: ["Indian Idol Winner", "Playback Singer"],
    socialLinks: ["https://www.instagram.com/officialsalman.ali"],
    gender: "Male" as const,
    language: ["Hindi" as const, "Urdu" as const],
    location: "Haryana",
    eventTypes: ["Concert" as const, "Wedding" as const],
    isFeatured: false
  }
];

async function addMoreSingers() {
  try {
    console.log("Adding more singers to the database...\n");
    
    await initializeMongoDB();
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const singer of moreSingers) {
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

addMoreSingers();
