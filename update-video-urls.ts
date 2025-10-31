import { readFileSync } from 'fs';

const BASE_URL = 'http://localhost:5000';

const videoUpdates: Record<string, string> = {
  'a-r-rahman': 'https://www.youtube.com/embed/gvyUuxdRdR4',
  'aastha-gill': 'https://www.youtube.com/embed/8pm_KoguqPM',
  'abhijeet-bhattacharya': 'https://www.youtube.com/embed/lJqbaGRCqTs',
  'aditi-singh-sharma': 'https://www.youtube.com/embed/y_TRdFSKGFQ',
  'adnan-sami': 'https://www.youtube.com/embed/vdXqH2RyHWI',
  'akhil-sachdeva': 'https://www.youtube.com/embed/mBLP0PL7A1o',
  'alka-yagnik': 'https://www.youtube.com/embed/kKaW7BLqEhU',
  'arijit-singh': 'https://www.youtube.com/embed/Umqb9KENgmk',
  'armaan-malik': 'https://www.youtube.com/embed/tZpQh_qNLmY',
  'asees-kaur': 'https://www.youtube.com/embed/gvyUuxdRdR4',
  'ankit-tiwari': 'https://www.youtube.com/embed/ydPLG5baFEw',
  'amit-trivedi': 'https://www.youtube.com/embed/QbTbs5f8f7M',
  'ali-zafar': 'https://www.youtube.com/embed/EXRKUHHuNiE',
  'amit-mishra': 'https://www.youtube.com/embed/lJ03hxBl5rM',
  'amit-kumar': 'https://www.youtube.com/embed/Rc-Jh3Oe0Gc',
  'amitabh-bhattacharya': 'https://www.youtube.com/embed/bzSTpdcs-EA',
  'anushka-manchanda': 'https://www.youtube.com/embed/FXAgw0g4bZ0',
  'anuradha-paudwal': 'https://www.youtube.com/embed/ven8xBmDXJo',
  'anu-malik': 'https://www.youtube.com/embed/3Tm_IPLQ3js',
  'alisha-chinai': 'https://www.youtube.com/embed/vTIIMJ9tUc8'
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

  console.log('Fetching celebrities...');
  const celebsRes = await fetch(`${BASE_URL}/api/celebrities`, {
    headers: { 'Cookie': cookieJar.join('; ') }
  });

  if (!celebsRes.ok) {
    console.error('Failed to fetch celebrities:', await celebsRes.text());
    return;
  }

  const celebrities = await celebsRes.json();
  console.log(`Found ${celebrities.length} celebrities\n`);

  let updated = 0;
  for (const celeb of celebrities) {
    const newVideoUrl = videoUpdates[celeb.slug];
    
    if (newVideoUrl && celeb.videoUrl !== newVideoUrl) {
      console.log(`Updating ${celeb.name} (${celeb.slug})...`);
      console.log(`  Old: ${celeb.videoUrl}`);
      console.log(`  New: ${newVideoUrl}`);
      
      const updateRes = await fetch(`${BASE_URL}/api/celebrities/${celeb._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieJar.join('; ')
        },
        body: JSON.stringify({
          ...celeb,
          videoUrl: newVideoUrl
        })
      });

      if (updateRes.ok) {
        console.log(`  ✓ Updated successfully\n`);
        updated++;
      } else {
        console.error(`  ✗ Failed:`, await updateRes.text(), '\n');
      }
    }
  }

  console.log(`\nCompleted! Updated ${updated} celebrities.`);
}

main().catch(console.error);
