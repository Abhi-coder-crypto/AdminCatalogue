const BASE_URL = 'http://localhost:5000';

interface Celebrity {
  name: string;
  profileImage: string;
}

const imageUpdates: Celebrity[] = [
  // ACTORS
  {
    name: "Aamir Khan",
    profileImage: "https://w0.peakpx.com/wallpaper/861/196/HD-wallpaper-aamir-khan-basit-rdm-thumbnail.jpg"
  },
  {
    name: "Aasif Sheikh",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnC8xXakIPKDgd-Z5wjVaNongHJRULd-8ZTg&s"
  },
  {
    name: "Abhimanyu Dassani",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEFp2yhN1IZo93Yt0l0FAo25xFCZZTk3vgA&s"
  },
  {
    name: "Abhinav Shukla",
    profileImage: "https://www.bollywoodhungama.com/wp-content/uploads/2016/03/Abhinav-Shukla-hs.jpg"
  },
  {
    name: "Abhishek Bachchan",
    profileImage: "https://images.indianexpress.com/2025/03/Abhishek-Bachchan-edited_20241115093304_20250120073347_20250322044730.jpg"
  },

  // ACTRESSES
  {
    name: "Aahna Kumra",
    profileImage: "https://www.filmibeat.com/wimg/desktop/2023/07/aahana-kumra_26.jpg"
  },
  {
    name: "Aamna Sharif",
    profileImage: "https://i.pinimg.com/736x/5f/7e/d1/5f7ed1b5c3f60f556225ca3cf790a9a0.jpg"
  },
  {
    name: "Aanchal Munjal",
    profileImage: "https://m.media-amazon.com/images/M/MV5BNTBkZDcwNTMtYWNiYy00OWUzLTk4MDgtYjQ0YWY5MTIyZjYzXkEyXkFqcGc@._V1_.jpg"
  },
  {
    name: "Aarti Chhabria",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Aarti_Chabria_graces_Stardust_Awards_2016_%2801%29.jpg"
  },
  {
    name: "Aashka Goradia",
    profileImage: "https://i.pinimg.com/474x/c9/18/b9/c918b9c4366e663218cf7744dc731ac9.jpg"
  },

  // COMEDIANS
  {
    name: "Abhishek Upmanyu",
    profileImage: "https://m.media-amazon.com/images/M/MV5BYmZiMzMxZDktZDAyYi00OGVlLWIwNGQtOWM0NWYxZTRiNzFiXkEyXkFqcGc@._V1_.jpg"
  },
  {
    name: "Ahsaan Qureshi",
    profileImage: "https://blackhattalent.com/wp-content/uploads/2024/01/Ahsaan-Qureshi-1.jpg"
  },
  {
    name: "Ali Asgar",
    profileImage: "https://m.media-amazon.com/images/M/MV5BNWJmYmQxMjctODMwOC00YTliLWFhY2UtZmFiNjg5OGJmOTUzXkEyXkFqcGc@._V1_.jpg"
  },
  {
    name: "Amit Bhadana",
    profileImage: "https://mediahindustan.com/wp-content/uploads/2022/10/Amit-Bhadana-Biography.jpg"
  },
  {
    name: "Anubhav Singh Bassi",
    profileImage: "https://www.mccawhall.com/assets/img/Anubhav-Singh-Bassi-Live_2024_brand-da30123073.jpg"
  }
];

async function updateImages() {
  console.log('Starting image update...\n');

  try {
    // Login first
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'Abhi@gmail.com',
        password: 'Abhi@123'
      })
    });

    if (!loginRes.ok) {
      throw new Error('Login failed');
    }

    const cookies = loginRes.headers.get('set-cookie') || '';
    console.log('✓ Logged in successfully\n');

    // Get all celebrities
    const getCelebritiesRes = await fetch(`${BASE_URL}/api/celebrities`, {
      headers: { Cookie: cookies }
    });

    if (!getCelebritiesRes.ok) {
      throw new Error('Failed to fetch celebrities');
    }

    const allCelebrities = await getCelebritiesRes.json();

    // Update each celebrity
    let successCount = 0;
    let failCount = 0;

    for (const update of imageUpdates) {
      try {
        // Find celebrity by name
        const celebrity = allCelebrities.find((c: any) => c.name === update.name);
        
        if (!celebrity) {
          console.log(`✗ Celebrity not found: ${update.name}`);
          failCount++;
          continue;
        }

        // Update the celebrity
        const updateRes = await fetch(`${BASE_URL}/api/celebrities/${celebrity._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookies
          },
          body: JSON.stringify({
            ...celebrity,
            profileImage: update.profileImage
          })
        });

        if (!updateRes.ok) {
          const error = await updateRes.text();
          console.log(`✗ Failed to update ${update.name}: ${error}`);
          failCount++;
        } else {
          console.log(`✓ Updated ${update.name}`);
          successCount++;
        }
      } catch (error) {
        console.log(`✗ Error updating ${update.name}:`, error);
        failCount++;
      }
    }

    console.log(`\n✓ Update complete: ${successCount} successful, ${failCount} failed`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateImages();
