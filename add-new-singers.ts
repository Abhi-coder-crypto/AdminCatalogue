const BASE_URL = 'http://localhost:5000';

const newSingers = [
  // List 2
  'Ash King',
  'Asha Bhosle',
  'Aditya Narayan',
  'Atif Aslam',
  'Darshan Raval',
  'Dev Negi',
  'Dhvani Bhanushali',
  'Diljit Dosanjh',
  'Divya Kumar',
  'Falguni Pathak',
  'Gajendra Verma',
  'Guru Randhawa',
  'Harshdeep Kaur',
  'Himesh Reshammiya',
  'Honey Singh',
  'Richa Sharma',
  'Javed Ali',
  'Jonita Gandhi',
  'Jubin Nautiyal',
  'Jyotica Tangri',
  
  // List 3
  'Kanika Kapoor',
  'Kavita Krishnamurti',
  'Kavita Seth',
  'Kumar Sanu',
  'Kunal Ganjawala',
  'Lucky Ali',
  'Mahalakshmi Iyer',
  'Master Saleem',
  'Shankar Mahadevan',
  'Shaan',
  'Sachin–Jigar',
  'Ajay–Atul',
  'Neha Kakkar',
  'Shreya Ghoshal',
  'Tanishk Bagchi',
  'Sonu Nigam',
  'Udit Narayan',
  'Karan Aujla',
  'A.P. Dhillon',
  'Neeti Mohan',
  
  // List 4
  'Vidya Vox',
  'Nikitha Gandhi',
  'Palak Mucchal',
  'Amaal Malik',
  'Arjun Kanungo',
  'Nakash Aziz',
  'Shashwat Singh',
  'Laqshya Kapoor',
  'Abhay Jodhpurkar',
  'Sachet & Parampara Tandon',
  'Gurdeep Mehndi',
  'Mohammed Irfan',
  'Divyakumar',
  'Abhijeet Sawant',
  'Lisa Mishra',
  'Pawandeep Rajan',
  'Benny Dayal',
  'Ayushmann Khurrana'
];

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[–&]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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

  console.log('Login successful!\n');

  let added = 0;
  let skipped = 0;

  for (const name of newSingers) {
    const slug = createSlug(name);
    
    console.log(`Adding ${name} (${slug})...`);
    
    const celebrity = {
      name,
      slug,
      category: 'Singers',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      videoUrl: '',
      bio: `${name} is a talented Indian playback singer known for contributions to Bollywood and regional music. More details to be added.`,
      achievements: ['Renowned playback singer'],
      socialLinks: [],
      gender: 'Male',
      language: ['Hindi'],
      location: 'Mumbai, Maharashtra',
      priceRange: 'Mid-Range',
      eventTypes: ['Concert', 'Wedding', 'Corporate'],
      isFeatured: false
    };

    const createRes = await fetch(`${BASE_URL}/api/celebrities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieJar.join('; ')
      },
      body: JSON.stringify(celebrity)
    });

    if (createRes.ok) {
      console.log(`  ✓ Added successfully\n`);
      added++;
    } else {
      const error = await createRes.text();
      if (error.includes('duplicate') || error.includes('already exists')) {
        console.log(`  ⊘ Already exists, skipped\n`);
        skipped++;
      } else {
        console.error(`  ✗ Failed:`, error, '\n');
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Added: ${added}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total processed: ${newSingers.length}`);
}

main().catch(console.error);
