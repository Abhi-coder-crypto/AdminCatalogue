import { writeFileSync, readFileSync } from 'fs';

const BASE_URL = 'http://localhost:5000';

interface Celebrity {
  _id: string;
  name: string;
  slug: string;
  videoUrl?: string;
  image: string;
  [key: string]: any;
}

// YouTube video IDs for each celebrity (verified working videos)
const youtubeUpdates: Record<string, string> = {
  // Verified from web search
  'a-r-rahman': 'qoq8B8ThgEM', // Kun Faya Kun - Rockstar
  'abhijeet-bhattacharya': 'vDCnew2uhT4', // Main Koi Aisa Geet Gaoon
  'anuradha-paudwal': 'nwRoHC83wx0', // Gayatri Mantra 108 times
  'alka-yagnik': '6SGRn9OHtFY', // Agar Tum Saath Ho - Tamasha
  'ankit-tiwari': 'FxAG_11PzCk', // Galliyan - Ek Villain
  'asees-kaur': 'gvyUuxdRdR4', // Raatan Lambiyan - Shershaah
  
  // Popular verified songs
  'arijit-singh': 'Umqb9KENgmk', // Tum Hi Ho - Aashiqui 2
  'armaan-malik': 'kJa2kwoZ2a4', // Chale Aana - De De Pyaar De
  'aastha-gill': '0XpAkNsEBwE', // Buzz feat Badshah
  'adnan-sami': 'vdXqH2RyHWI', // Lift Kara De
  'aditi-singh-sharma': '3OatUwTTsh8', // Sooraj Dooba Hain - Roy
  'akhil-sachdeva': 'QGSJQqTHcN4', // Tera Ban Jaunga - Kabir Singh
  'ali-zafar': 'EXRKUHHuNiE', // Rockstar
  'alisha-chinai': 'vTIIMJ9tUc8', // Kajra Re
  'amit-kumar': 'Rc-Jh3Oe0Gc', // Bade Achhe Lagte Hain
  'amit-mishra': 'lJ03hxBl5rM', // Bulleya - Ae Dil Hai Mushkil
  'amit-trivedi': 'QbTbs5f8f7M', // Nayan Tarse - Dev D
  'amitabh-bhattacharya': 'bzSTpdcs-EA', // Channa Mereya
  'anu-malik': '3Tm_IPLQ3js', // Taal Se Taal Mila
  'anushka-manchanda': 'FXAgw0g4bZ0', // Dum Maaro Dum
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
    console.error('Login failed:', await loginRes.text());
    return;
  }

  console.log('Login successful!');

  // Read existing celebrities
  const celebrities: Celebrity[] = JSON.parse(readFileSync('celebrities.json', 'utf-8'));
  
  let updated = 0;
  let failed = 0;

  for (const celeb of celebrities) {
    const videoId = youtubeUpdates[celeb.slug];
    
    if (!videoId) {
      console.log(`⚠️  No video ID found for ${celeb.name} (${celeb.slug})`);
      failed++;
      continue;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    console.log(`Updating ${celeb.name}...`);
    
    const updateRes = await fetch(`${BASE_URL}/api/celebrities/${celeb._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieJar.join('; ')
      },
      body: JSON.stringify({
        ...celeb,
        videoUrl: embedUrl
      })
    });

    if (updateRes.ok) {
      console.log(`✓ Updated ${celeb.name} with video ${videoId}`);
      updated++;
    } else {
      const error = await updateRes.text();
      console.error(`✗ Failed to update ${celeb.name}:`, error);
      failed++;
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n=== Update Complete ===`);
  console.log(`✓ Successfully updated: ${updated}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Total: ${celebrities.length}`);
}

main().catch(console.error);
