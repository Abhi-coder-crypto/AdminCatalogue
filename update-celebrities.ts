import { writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:5000';

interface Celebrity {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  videoUrl?: string;
  bio: string;
  achievements: string[];
  socialLinks: { platform: string; url: string }[];
  gender: string;
  language: string[];
  location: string;
  priceRange: string;
  eventTypes: string[];
  isFeatured: boolean;
}

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

  const celebrities: Celebrity[] = await celebsRes.json();
  console.log(`Found ${celebrities.length} celebrities`);

  writeFileSync('celebrities.json', JSON.stringify(celebrities, null, 2));
  console.log('Saved to celebrities.json');
}

main().catch(console.error);
