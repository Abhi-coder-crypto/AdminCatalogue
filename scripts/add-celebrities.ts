const API_BASE = 'http://localhost:5000/api';

// Login and get session cookie
async function login() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'Abhi@gmail.com',
      password: 'Abhi@123'
    })
  });
  
  const cookie = response.headers.get('set-cookie');
  if (!cookie) throw new Error('Login failed');
  
  return cookie;
}

// Create celebrity
async function createCelebrity(cookie: string, celebrity: any) {
  const response = await fetch(`${API_BASE}/celebrities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify(celebrity)
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to create ${celebrity.name}:`, error);
    return false;
  }
  
  console.log(`✓ Created ${celebrity.name}`);
  return true;
}

// Celebrity data
const celebrities = [
  // ACTORS
  {
    name: "Aamir Khan",
    slug: "aamir-khan",
    category: "Actors",
    image: "https://via.placeholder.com/400x400?text=Aamir+Khan",
    bio: "Aamir Khan is one of the most celebrated actors in Bollywood, known for his versatility and dedication to his craft. He has starred in numerous critically acclaimed and commercially successful films.",
    achievements: ["Padma Shri", "Padma Bhushan", "Multiple Filmfare Awards"],
    socialLinks: ["https://www.instagram.com/aamirkhanproductions/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Aasif Sheikh",
    slug: "aasif-sheikh",
    category: "Actors",
    image: "https://via.placeholder.com/400x400?text=Aasif+Sheikh",
    bio: "Aasif Sheikh is a renowned Indian television actor known for his versatile performances across various TV shows and films. He has captivated audiences with his exceptional acting skills.",
    achievements: ["Popular TV Actor", "Known for Bhabi Ji Ghar Par Hai"],
    socialLinks: ["https://www.instagram.com/iaasifsheikhofficial/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },
  {
    name: "Abhimanyu Dassani",
    slug: "abhimanyu-dassani",
    category: "Actors",
    image: "https://via.placeholder.com/400x400?text=Abhimanyu+Dassani",
    bio: "Abhimanyu Dassani is an Indian actor known for his debut film Mard Ko Dard Nahi Hota. He has quickly made a name for himself with his unique film choices and performances.",
    achievements: ["Filmfare Award for Best Male Debut"],
    socialLinks: ["https://www.instagram.com/abhimanyud/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: false
  },
  {
    name: "Abhinav Shukla",
    slug: "abhinav-shukla",
    category: "Actors",
    image: "https://via.placeholder.com/400x400?text=Abhinav+Shukla",
    bio: "Abhinav Shukla is an Indian television and film actor known for his work in various TV shows and his appearance on Bigg Boss. He is also passionate about adventure and nature.",
    achievements: ["Popular TV Actor", "Bigg Boss Contestant"],
    socialLinks: ["https://www.instagram.com/ashukla09/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },
  {
    name: "Abhishek Bachchan",
    slug: "abhishek-bachchan",
    category: "Actors",
    image: "https://via.placeholder.com/400x400?text=Abhishek+Bachchan",
    bio: "Abhishek Bachchan is a prominent Bollywood actor and film producer, known for his versatile performances in both commercial and critically acclaimed films. He comes from the legendary Bachchan family.",
    achievements: ["National Film Award", "Multiple Filmfare Awards"],
    socialLinks: ["https://www.instagram.com/bachchan/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },

  // ACTRESSES
  {
    name: "Aahna Kumra",
    slug: "aahna-kumra",
    category: "Actresses",
    image: "https://via.placeholder.com/400x400?text=Aahna+Kumra",
    bio: "Aahana Kumra is an Indian actress known for her work in films, television, and theatre. She has delivered powerful performances in projects like Lipstick Under My Burkha and Yudh.",
    achievements: ["Theatre Artist", "Acclaimed Film Actress"],
    socialLinks: ["https://www.instagram.com/aahanakumra/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: false
  },
  {
    name: "Aamna Sharif",
    slug: "aamna-sharif",
    category: "Actresses",
    image: "https://via.placeholder.com/400x400?text=Aamna+Sharif",
    bio: "Aamna Sharif is a popular Indian television and film actress known for her roles in shows like Kahiin to Hoga and Kasautii Zindagii Kay 2. She has won hearts with her performances.",
    achievements: ["Popular TV Actress", "Style Icon"],
    socialLinks: ["https://www.instagram.com/aamnasharifofficial/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },
  {
    name: "Aanchal Munjal",
    slug: "aanchal-munjal",
    category: "Actresses",
    image: "https://via.placeholder.com/400x400?text=Aanchal+Munjal",
    bio: "Aanchal Munjal is an Indian actress and content creator known for her work in television and digital media. She has built a strong following with her engaging content and performances.",
    achievements: ["TV Actress", "Content Creator"],
    socialLinks: ["https://www.instagram.com/aanchalmunjalofficial/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Budget",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },
  {
    name: "Aarti Chhabria",
    slug: "aarti-chhabria",
    category: "Actresses",
    image: "https://via.placeholder.com/400x400?text=Aarti+Chhabria",
    bio: "Aarti Chabria is an Indian actress and former model who appears in Hindi, Telugu, Punjabi, and Kannada films. She won Miss India Worldwide 1999 and has expanded into direction and wellness coaching.",
    achievements: ["Miss India Worldwide 1999", "Film Director", "Wellness Coach"],
    socialLinks: ["https://www.instagram.com/aartichabria/"],
    gender: "Female",
    language: ["Hindi", "English", "Telugu", "Punjabi"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: false
  },
  {
    name: "Aashka Goradia",
    slug: "aashka-goradia",
    category: "Actresses",
    image: "https://via.placeholder.com/400x400?text=Aashka+Goradia",
    bio: "Aashka Goradia is an Indian television actress, entrepreneur, and yoga practitioner. She is the founder of beauty brands Renee and Princess by Renee, and is known for her versatile performances.",
    achievements: ["Entrepreneur", "Fortune 40 under 40", "TV Actress"],
    socialLinks: ["https://www.instagram.com/aashkagoradia/"],
    gender: "Female",
    language: ["Hindi", "English", "Gujarati"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },

  // STANDUP COMEDIANS
  {
    name: "Abhishek Upmanyu",
    slug: "abhishek-upmanyu",
    category: "Comedians",
    image: "https://via.placeholder.com/400x400?text=Abhishek+Upmanyu",
    bio: "Abhishek Upmanyu is one of India's most popular stand-up comedians, known for his relatable humor and witty sarcasm. His comedy specials have garnered millions of views on YouTube.",
    achievements: ["Popular Stand-up Comedian", "YouTuber with 5M+ subscribers"],
    socialLinks: ["https://www.instagram.com/aupmanyu/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Concert"],
    isFeatured: true
  },
  {
    name: "Ahsaan Qureshi",
    slug: "ahsaan-qureshi",
    category: "Comedians",
    image: "https://via.placeholder.com/400x400?text=Ahsaan+Qureshi",
    bio: "Ahsaan Qureshi is an Indian stand-up comedian and actor known for his political satire and social commentary. He was runner-up in The Great Indian Laughter Challenge and appeared on Bigg Boss.",
    achievements: ["The Great Indian Laughter Challenge Runner-up", "Bigg Boss Contestant"],
    socialLinks: ["https://www.instagram.com/ahsaanqureshi_/"],
    gender: "Male",
    language: ["Hindi", "Urdu"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Concert"],
    isFeatured: false
  },
  {
    name: "Ali Asgar",
    slug: "ali-asgar",
    category: "Comedians",
    image: "https://via.placeholder.com/400x400?text=Ali+Asgar",
    bio: "Ali Asgar is a well-known Indian television actor and comedian, famous for his comic timing and versatile character portrayals. He has entertained audiences for years with his performances.",
    achievements: ["Popular TV Comedian", "Versatile Character Actor"],
    socialLinks: ["https://www.instagram.com/kingaliasgar/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: false
  },
  {
    name: "Amit Bhadana",
    slug: "amit-bhadana",
    category: "Comedians",
    image: "https://via.placeholder.com/400x400?text=Amit+Bhadana",
    bio: "Amit Bhadana is a popular Indian YouTuber and content creator known for his comedy videos. His relatable content and unique style have made him one of India's top digital creators.",
    achievements: ["YouTube Star", "Content Creator with 10M+ Instagram followers"],
    socialLinks: ["https://www.instagram.com/theamitbhadana/"],
    gender: "Male",
    language: ["Hindi"],
    location: "Delhi",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Anubhav Singh Bassi",
    slug: "anubhav-singh-bassi",
    category: "Comedians",
    image: "https://via.placeholder.com/400x400?text=Anubhav+Singh+Bassi",
    bio: "Anubhav Singh Bassi is one of India's most popular stand-up comedians, known for his anecdotal storytelling style. His YouTube videos have garnered over 200 million views.",
    achievements: ["Stand-up Comedian", "YouTube Star with 200M+ views"],
    socialLinks: ["https://www.instagram.com/be_a_bassi/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Delhi",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Concert"],
    isFeatured: true
  },

  // SOCIAL MEDIA INFLUENCERS
  {
    name: "Aashish Chanchalani",
    slug: "aashish-chanchalani",
    category: "Influencers",
    image: "https://via.placeholder.com/400x400?text=Aashish+Chanchalani",
    bio: "Ashish Chanchlani is one of India's most popular content creators and YouTubers, known for his comedy videos and relatable content. He has a massive following across social media platforms.",
    achievements: ["YouTube Creator with 30M+ subscribers", "Social Media Influencer"],
    socialLinks: ["https://www.instagram.com/ashishchanchlani/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Aashna Shroff",
    slug: "aashna-shroff",
    category: "Influencers",
    image: "https://via.placeholder.com/400x400?text=Aashna+Shroff",
    bio: "Aashna Shroff is a fashion and beauty influencer, YouTuber, and entrepreneur. She founded Snob Home and is known for her content on fashion, beauty, lifestyle, and home decor.",
    achievements: ["Fashion Influencer", "Entrepreneur", "Founder of Snob Home"],
    socialLinks: ["https://www.instagram.com/aashnashroff/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Awez Darbar",
    slug: "awez-darbar",
    category: "Influencers",
    image: "https://via.placeholder.com/400x400?text=Awez+Darbar",
    bio: "Awez Darbar is a popular Indian choreographer, dancer, and social media influencer known for his dance videos and choreography. He has a massive following of 30 million on Instagram.",
    achievements: ["Choreographer", "Dancer", "Bigg Boss 19 Contestant"],
    socialLinks: ["https://www.instagram.com/awez_darbar/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },
  {
    name: "Bhuvan Bam",
    slug: "bhuvan-bam",
    category: "Influencers",
    image: "https://via.placeholder.com/400x400?text=Bhuvan+Bam",
    bio: "Bhuvan Bam is an Indian actor, singer-songwriter, comedian, and entrepreneur, best known for his YouTube channel BB Ki Vines. He was one of the first independent Indian creators to cross 10 million subscribers.",
    achievements: ["YouTube Star", "Singer-Songwriter", "Forbes 30 Under 30"],
    socialLinks: ["https://www.instagram.com/bhuvan.bam22/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Delhi",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Concert"],
    isFeatured: true
  },
  {
    name: "CarryMinati",
    slug: "carryminati",
    category: "Influencers",
    image: "https://via.placeholder.com/400x400?text=CarryMinati",
    bio: "CarryMinati (Ajey Nagar) is India's top YouTuber known for his roasting videos, comedy, and gaming streams. He is the most-subscribed individual YouTuber in Asia with 43+ million subscribers.",
    achievements: ["Top YouTuber in Asia", "43M+ YouTube Subscribers"],
    socialLinks: ["https://www.instagram.com/carryminati/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Faridabad",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },

  // CELEBRITY CHOREOGRAPHERS
  {
    name: "Ahmed Khan",
    slug: "ahmed-khan",
    category: "Choreographers",
    image: "https://via.placeholder.com/400x400?text=Ahmed+Khan",
    bio: "Ahmed Khan is a renowned Bollywood choreographer and director, known for his work on hit films like Rangeela, Ghajini, and Bang Bang. He has won multiple awards for his choreography.",
    achievements: ["Filmfare Award for Best Choreography", "Film Director"],
    socialLinks: ["https://www.instagram.com/khan_ahmedasas/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },
  {
    name: "Ganesh Acharya",
    slug: "ganesh-acharya",
    category: "Choreographers",
    image: "https://via.placeholder.com/400x400?text=Ganesh+Acharya",
    bio: "Ganesh Acharya is a two-time National Award-winning choreographer, director, and actor in Bollywood. He has choreographed over 500 songs across 200+ films in his 30-year career.",
    achievements: ["Two National Film Awards", "500+ Songs Choreographed"],
    socialLinks: ["https://www.instagram.com/ganeshacharyaa/"],
    gender: "Male",
    language: ["Hindi", "English", "Tamil"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },
  {
    name: "Farah Khan",
    slug: "farah-khan",
    category: "Choreographers",
    image: "https://via.placeholder.com/400x400?text=Farah+Khan",
    bio: "Farah Khan is one of Bollywood's most celebrated choreographers and filmmakers. She has choreographed over 100 songs and directed successful films like Main Hoon Na and Om Shanti Om.",
    achievements: ["National Film Award", "Seven Filmfare Awards", "Film Director"],
    socialLinks: ["https://www.instagram.com/farahkhankunder/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },
  {
    name: "Geeta Kapoor",
    slug: "geeta-kapoor",
    category: "Choreographers",
    image: "https://via.placeholder.com/400x400?text=Geeta+Kapoor",
    bio: "Geeta Kapur is a masterful choreographer, dancer, and television personality, best known as a judge on Dance India Dance and Super Dancer. She started her career in Farah Khan's troupe.",
    achievements: ["Dance India Dance Judge", "Renowned Choreographer"],
    socialLinks: ["https://www.instagram.com/geeta_kapurofficial/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },
  {
    name: "Prabhu Deva",
    slug: "prabhu-deva",
    category: "Choreographers",
    image: "https://via.placeholder.com/400x400?text=Prabhu+Deva",
    bio: "Prabhu Deva is a legendary Indian choreographer, film director, and actor, known as the Indian Michael Jackson. He has won two National Film Awards and received the Padma Shri in 2019.",
    achievements: ["Padma Shri", "Two National Film Awards", "Indian Michael Jackson"],
    socialLinks: ["https://www.instagram.com/prabhudevaofficial/"],
    gender: "Male",
    language: ["Hindi", "English", "Tamil", "Telugu"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party", "Wedding"],
    isFeatured: true
  },

  // CELEBRITY CHEFS
  {
    name: "Ajay Chopra",
    slug: "ajay-chopra",
    category: "Chefs",
    image: "https://via.placeholder.com/400x400?text=Ajay+Chopra",
    bio: "Chef Ajay Chopra is a celebrity Indian chef, MasterChef India judge, TV host, and restaurant consultant. He is known for his global culinary expertise with a desi heart.",
    achievements: ["MasterChef India Judge", "Restaurant Owner", "Culinary Consultant"],
    socialLinks: ["https://www.instagram.com/chefajaychopra/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Sanjeev Kapoor",
    slug: "sanjeev-kapoor",
    category: "Chefs",
    image: "https://via.placeholder.com/400x400?text=Sanjeev+Kapoor",
    bio: "Sanjeev Kapoor is India's most celebrated celebrity chef, famous for hosting Khana Khazana. He is a Padma Shri Awardee, bestselling author, and successful restaurateur.",
    achievements: ["Padma Shri", "Guinness World Record", "MasterChef India Judge"],
    socialLinks: ["https://www.instagram.com/sanjeevkapoor/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Pankaj Bhadouria",
    slug: "pankaj-bhadouria",
    category: "Chefs",
    image: "https://via.placeholder.com/400x400?text=Pankaj+Bhadouria",
    bio: "Pankaj Bhadouria is India's first MasterChef winner, a TV host, author, and founder of Pankaj Bhadouria Culinary Academy. She left her teaching career to pursue her passion for cooking.",
    achievements: ["MasterChef India Season 1 Winner", "TEDx Speaker", "Culinary Academy Founder"],
    socialLinks: ["https://www.instagram.com/masterchefpankajbhadouria/"],
    gender: "Female",
    language: ["Hindi", "English"],
    location: "Lucknow",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Vikas Khanna",
    slug: "vikas-khanna",
    category: "Chefs",
    image: "https://via.placeholder.com/400x400?text=Vikas+Khanna",
    bio: "Vikas Khanna is a Michelin-starred Indian chef, restaurateur, and MasterChef India judge. He is ranked among the Top 10 Chefs in the World and has restaurants in New York and Dubai.",
    achievements: ["Michelin Star", "MasterChef India Judge", "Award-winning Filmmaker"],
    socialLinks: ["https://www.instagram.com/vikaskhannagroup/"],
    gender: "Male",
    language: ["Hindi", "English", "Punjabi"],
    location: "New York",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Ranveer Brar",
    slug: "ranveer-brar",
    category: "Chefs",
    image: "https://via.placeholder.com/400x400?text=Ranveer+Brar",
    bio: "Chef Ranveer Brar is a celebrity chef, MasterChef India judge, restaurateur, author, and TV host. Known as a Food Sufi, he combines culinary expertise with storytelling.",
    achievements: ["MasterChef India Judge", "Restaurateur", "YouTube Star with 4M+ subscribers"],
    socialLinks: ["https://www.instagram.com/ranveer.brar/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },

  // MOTIVATIONAL SPEAKERS
  {
    name: "Ankur Warikoo",
    slug: "ankur-warikoo",
    category: "Motivational Speakers",
    image: "https://via.placeholder.com/400x400?text=Ankur+Warikoo",
    bio: "Ankur Warikoo is one of India's leading motivational speakers, entrepreneurs, and bestselling authors. He simplifies complex topics around personal finance, career growth, and entrepreneurship.",
    achievements: ["Bestselling Author", "Former CEO", "Content Creator with 5M+ followers"],
    socialLinks: ["https://www.instagram.com/ankurwarikoo/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Delhi",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Chetan Bhagat",
    slug: "chetan-bhagat",
    category: "Motivational Speakers",
    image: "https://via.placeholder.com/400x400?text=Chetan+Bhagat",
    bio: "Chetan Bhagat is a renowned author, motivational speaker, columnist, and screenwriter. He has delivered talks at over 100 organizations worldwide on leadership, passion, and achieving goals.",
    achievements: ["Bestselling Author", "Time Magazine's 100 Most Influential People", "Former Investment Banker"],
    socialLinks: ["https://www.instagram.com/chetanbhagat/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Gaur Gopal Das",
    slug: "gaur-gopal-das",
    category: "Motivational Speakers",
    image: "https://via.placeholder.com/400x400?text=Gaur+Gopal+Das",
    bio: "Gaur Gopal Das is a monk, lifestyle coach, and motivational speaker with 10 million Instagram followers. He shares deeper spiritual insights and Vedic wisdom applied to modern life.",
    achievements: ["ISKCON Monk", "Bestselling Author", "Spoken at UN and British Parliament"],
    socialLinks: ["https://www.instagram.com/gaurgopaldas/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Mumbai",
    priceRange: "Premium",
    eventTypes: ["Corporate", "Private Party"],
    isFeatured: true
  },
  {
    name: "Harish Bijoor",
    slug: "harish-bijoor",
    category: "Motivational Speakers",
    image: "https://via.placeholder.com/400x400?text=Harish+Bijoor",
    bio: "Harish Bijoor is a renowned brand and business strategy consultant and motivational speaker. He has 19,000+ hours of public speaking experience and teaches at Indian School of Business.",
    achievements: ["Brand Strategy Expert", "ISB Faculty", "Author"],
    socialLinks: ["https://www.instagram.com/harishbijoor/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Bangalore",
    priceRange: "Premium",
    eventTypes: ["Corporate"],
    isFeatured: false
  },
  {
    name: "Ravishankar Iyer",
    slug: "ravishankar-iyer",
    category: "Motivational Speakers",
    image: "https://via.placeholder.com/400x400?text=Ravishankar+Iyer",
    bio: "Ravishankar Iyer is a business storytelling coach and motivational speaker, founder of Story Rules. He helps leaders and organizations tell impactful stories through data and narrative.",
    achievements: ["Storytelling Expert", "Founder of Story Rules", "TEDx Coach"],
    socialLinks: ["https://www.linkedin.com/in/ravishankar-iyer/"],
    gender: "Male",
    language: ["Hindi", "English"],
    location: "Bangalore",
    priceRange: "Mid-Range",
    eventTypes: ["Corporate"],
    isFeatured: false
  }
];

async function main() {
  console.log('Starting celebrity import...\n');
  
  const cookie = await login();
  console.log('✓ Logged in successfully\n');
  
  let success = 0;
  let failed = 0;
  
  for (const celebrity of celebrities) {
    const result = await createCelebrity(cookie, celebrity);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n✓ Import complete: ${success} successful, ${failed} failed`);
}

main().catch(console.error);
