import mongoose from 'mongoose';
import { CelebrityModel } from './server/models/celebrity';

// Connect to both databases
const adminMongoUri = process.env.ADMIN_MONGODB_URI || '';
const celebrityMongoUri = JSON.parse(
  require('fs').readFileSync('.mongodb-config.json', 'utf-8')
).mongoUri;

async function updateAllSingers() {
  try {
    // Connect to celebrity database
    await mongoose.connect(celebrityMongoUri);
    console.log('Connected to celebrity database');

    // Fetch all singers
    const singers = await CelebrityModel.find({ category: 'Singers' }).lean();
    console.log(`Found ${singers.length} singers in the database`);

    // Display which singers need updates
    let needsUpdate = 0;
    for (const singer of singers) {
      const missing = [];
      if (!singer.bio || singer.bio.length < 10) missing.push('bio');
      if (!singer.gender) missing.push('gender');
      if (!singer.language || singer.language.length === 0) missing.push('language');
      if (!singer.location) missing.push('location');
      if (!singer.eventTypes || singer.eventTypes.length === 0) missing.push('eventTypes');
      
      if (missing.length > 0) {
        console.log(`${singer.name} needs: ${missing.join(', ')}`);
        needsUpdate++;
      }
    }

    console.log(`\nTotal singers needing updates: ${needsUpdate}`);
    console.log(`Total singers already complete: ${singers.length - needsUpdate}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAllSingers();
