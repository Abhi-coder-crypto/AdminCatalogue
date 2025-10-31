import { writeFileSync, readFileSync } from 'fs';

const BASE_URL = 'http://localhost:5000';

// Manually verified YouTube video IDs and image URLs for each singer
const singerData: Record<string, { videoId: string; imageUrl: string }> = {
  'arijit-singh': {
    videoId: 'Umqb9KENgmk', // Tum Hi Ho official
    imageUrl: 'https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_500x500.jpg'
  },
  'asees-kaur': {
    videoId: 'gvyUuxdRdR4', // Raatan Lambiyan official
    imageUrl: 'https://c.saavncdn.com/artists/Asees_Kaur_500x500.jpg'
  },
  'armaan-malik': {
    videoId: 'kJa2kwoZ2a4', // Chale Aana official
    imageUrl: 'https://c.saavncdn.com/artists/Armaan_Malik_004_20230608084911_500x500.jpg'
  },
  'alka-yagnik': {
    videoId: '6SGRn9OHtFY', // Agar Tum Saath Ho
    imageUrl: 'https://c.saavncdn.com/artists/Alka_Yagnik_500x500.jpg'
  },
  'adnan-sami': {
    videoId: 'vdXqH2RyHWI', // Lift Kara De
    imageUrl: 'https://c.saavncdn.com/artists/Adnan_Sami_500x500.jpg'
  },
  'a-r-rahman': {
    videoId: 'qoq8B8ThgEM', // Kun Faya Kun
    imageUrl: 'https://c.saavncdn.com/artists/A_R_Rahman_004_20230519122208_500x500.jpg'
  },
  'abhijeet-bhattacharya': {
    videoId: 'vDCnew2uhT4', // Main Koi Aisa Geet Gaoon
    imageUrl: 'https://c.saavncdn.com/artists/Abhijeet_Bhattacharya_500x500.jpg'
  },
  'aditi-singh-sharma': {
    videoId: '3OatUwTTsh8', // Sooraj Dooba Hain
    imageUrl: 'https://c.saavncdn.com/artists/Aditi_Singh_Sharma_002_20191219094010_500x500.jpg'
  },
  'akhil-sachdeva': {
    videoId: 'QGSJQqTHcN4', // Tera Ban Jaunga
    imageUrl: 'https://c.saavncdn.com/artists/Akhil_Sachdeva_500x500.jpg'
  },
  'ali-zafar': {
    videoId: 'EXRKUHHuNiE', // Rockstar
    imageUrl: 'https://c.saavncdn.com/artists/Ali_Zafar_500x500.jpg'
  },
  'alisha-chinai': {
    videoId: 'vTIIMJ9tUc8', // Kajra Re
    imageUrl: 'https://c.saavncdn.com/artists/Alisha_Chinai_500x500.jpg'
  },
  'amit-kumar': {
    videoId: 'Rc-Jh3Oe0Gc', // Bade Achhe Lagte Hain
    imageUrl: 'https://c.saavncdn.com/artists/Amit_Kumar_500x500.jpg'
  },
  'amit-mishra': {
    videoId: 'lJ03hxBl5rM', // Bulleya
    imageUrl: 'https://c.saavncdn.com/artists/Amit_Mishra_500x500.jpg'
  },
  'amit-trivedi': {
    videoId: 'QbTbs5f8f7M', // Nayan Tarse
    imageUrl: 'https://c.saavncdn.com/artists/Amit_Trivedi_006_20230608084933_500x500.jpg'
  },
  'amitabh-bhattacharya': {
    videoId: 'bzSTpdcs-EA', // Channa Mereya
    imageUrl: 'https://c.saavncdn.com/artists/Amitabh_Bhattacharya_500x500.jpg'
  },
  'anu-malik': {
    videoId: '3Tm_IPLQ3js', // Taal Se Taal
    imageUrl: 'https://c.saavncdn.com/artists/Anu_Malik_500x500.jpg'
  },
  'ankit-tiwari': {
    videoId: 'FxAG_11PzCk', // Galliyan
    imageUrl: 'https://c.saavncdn.com/artists/Ankit_Tiwari_500x500.jpg'
  },
  'anuradha-paudwal': {
    videoId: 'nwRoHC83wx0', // Gayatri Mantra
    imageUrl: 'https://c.saavncdn.com/artists/Anuradha_Paudwal_500x500.jpg'
  },
  'anushka-manchanda': {
    videoId: 'FXAgw0g4bZ0', // Dum Maaro Dum
    imageUrl: 'https://c.saavncdn.com/artists/Anushka_Manchanda_500x500.jpg'
  },
  'aastha-gill': {
    videoId: '0XpAkNsEBwE', // Buzz
    imageUrl: 'https://c.saavncdn.com/artists/Aastha_Gill_002_20200720084823_500x500.jpg'
  }
};

async function main() {
  const cookieJar: string[] = [];

  console.log('Logging in...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'Abhi@gmail.com',
      password: 'Abhi@123'
    })
  });

  const setCookieHeader = loginRes.headers.get('set-cookie');
  if (setCookieHeader) {
    cookieJar.push(setCookieHeader);
  }

  if (!loginRes.ok) {
    console.error('Login failed');
    return;
  }

  console.log('✓ Logged in\n');

  const celebrities = JSON.parse(readFileSync('celebrities.json', 'utf-8'));
  
  let updated = 0;

  for (const celeb of celebrities) {
    const data = singerData[celeb.slug];
    
    if (!data) {
      console.log(`⚠️  No data for ${celeb.name}`);
      continue;
    }

    console.log(`Updating ${celeb.name}...`);
    
    const updateRes = await fetch(`${BASE_URL}/api/celebrities/${celeb._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieJar.join('; ')
      },
      body: JSON.stringify({
        ...celeb,
        videoUrl: `https://www.youtube.com/embed/${data.videoId}`,
        image: data.imageUrl
      })
    });

    if (updateRes.ok) {
      console.log(`✓ Updated ${celeb.name}`);
      updated++;
    } else {
      console.error(`✗ Failed: ${await updateRes.text()}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✓ Updated ${updated}/${celebrities.length} singers`);
}

main().catch(console.error);
