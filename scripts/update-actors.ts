const API_URL = 'http://localhost:5000';

async function updateActors() {
  try {
    console.log('Logging in as admin...\n');
    
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'Abhi@gmail.com',
        password: 'Abhi@123'
      })
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    if (!cookies) {
      throw new Error('No session cookie received from login');
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful!');
    
    const headers = { 
      'Cookie': cookies,
      'Content-Type': 'application/json'
    };

    console.log('Fetching all celebrities...\n');
    
    const celebritiesResponse = await fetch(`${API_URL}/api/celebrities`, { headers });
    const data = await celebritiesResponse.json();
    
    if (!Array.isArray(data)) {
      console.log('Unexpected response:', JSON.stringify(data, null, 2));
      throw new Error('Expected array of celebrities');
    }
    
    const celebrities = data;

    // Find Akshaye Khanna
    const akshayeKhanna = celebrities.find((c: any) => c.name === 'Akshaye Khanna');
    if (akshayeKhanna) {
      console.log('Updating Akshaye Khanna Instagram...');
      await fetch(
        `${API_URL}/api/celebrities/${akshayeKhanna._id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...akshayeKhanna,
            instagram: 'https://www.instagram.com/akshaye_khanna_/'
          })
        }
      );
      console.log('✓ Updated Akshaye Khanna: @akshaye_khanna_\n');
    }

    // Find Agastya Nanda
    const agastyaNanda = celebrities.find((c: any) => c.name === 'Agastya Nanda');
    if (agastyaNanda) {
      console.log('Updating Agastya Nanda Instagram...');
      await fetch(
        `${API_URL}/api/celebrities/${agastyaNanda._id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...agastyaNanda,
            instagram: 'https://www.instagram.com/agastya.nanda/'
          })
        }
      );
      console.log('✓ Updated Agastya Nanda: @agastya.nanda\n');
    }

    console.log('✓ All Instagram handles updated successfully!');
  } catch (error: any) {
    console.error('Error updating actors:', error.message);
    process.exit(1);
  }
}

updateActors();
