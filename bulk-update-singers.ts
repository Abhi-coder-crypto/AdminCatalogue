import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { celebrityConnection } from './server/mongodb';

const CONFIG_PATH = '.mongodb-config.json';

interface MongoDBConfig {
  celebrityMongoUri: string;
}

// Load MongoDB config
function loadConfig(): string {
  const data = readFileSync(CONFIG_PATH, 'utf-8');
  const config: MongoDBConfig = JSON.parse(data);
  return config.celebrityMongoUri;
}

// Define the celebrity schema  
const celebritySchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  image: String,
  bio: String,
  achievements: [String],
  socialLinks: [String],
  videoUrl: String,
  gender: String,
  language: [String],
  location: String,
  priceRange: String,
  eventTypes: [String],
  isFeatured: Boolean,
  views: Number,
}, { timestamps: true });

async function updateAllSingers() {
  try {
    // Connect to celebrity database
    const mongoUri = loadConfig();
    await mongoose.connect(mongoUri);
    console.log('Connected to celebrity database');

    const Celebrity = mongoose.model('Celebrity', celebritySchema);

    // Fetch all singers
    const singers = await Celebrity.find({ category: 'Singers' });
    console.log(`\nFound ${singers.length} singers in the database\n`);

    let updated = 0;
    let skipped = 0;

    for (const singer of singers) {
      const updates: any = {};
      let needsUpdate = false;

      // Check and fill required fields
      if (!singer.get('bio') || singer.get('bio').length < 10) {
        updates.bio = `${singer.get('name')} is a talented Indian singer known for their versatile voice and performances across various musical genres. With a growing fan base and numerous successful tracks, they continue to make their mark in the Indian music industry through live concerts, studio recordings, and collaborations with top music directors.`;
        needsUpdate = true;
      }

      if (!singer.get('gender')) {
        // Try to infer gender from name (simple heuristic)
        const name = singer.get('name').toLowerCase();
        if (name.includes('kumar') || name.includes('raj') || name.includes('deep') || name.includes('veer') || name.includes('singh')) {
          updates.gender = 'Male';
        } else if (name.includes('devi') || name.includes('rani') || name.includes('kumari')) {
          updates.gender = 'Female';
        } else {
          updates.gender = 'Male'; // Default
        }
        needsUpdate = true;
      }

      if (!singer.get('language') || singer.get('language').length === 0) {
        updates.language = ['Hindi', 'English', 'Punjabi'];
        needsUpdate = true;
      }

      if (!singer.get('location')) {
        updates.location = 'Mumbai, Maharashtra';
        needsUpdate = true;
      }

      if (!singer.get('eventTypes') || singer.get('eventTypes').length === 0) {
        updates.eventTypes = ['Wedding', 'Concert', 'Corporate', 'Private Party'];
        needsUpdate = true;
      }

      if (!singer.get('achievements') || singer.get('achievements').length === 0) {
        updates.achievements = [
          'Multiple successful live performances',
          'Growing social media following',
          'Collaborations with renowned music directors',
          'Regular performer at major events'
        ];
        needsUpdate = true;
      }

      if (!singer.get('priceRange')) {
        updates.priceRange = 'Mid-Range';
        needsUpdate = true;
      }

      if (singer.get('isFeatured') === undefined) {
        updates.isFeatured = false;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Celebrity.updateOne({ _id: singer._id }, { $set: updates });
        console.log(`✓ Updated: ${singer.get('name')}`);
        updated++;
      } else {
        console.log(`○ Skipped (complete): ${singer.get('name')}`);
        skipped++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Total singers: ${singers.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Already complete: ${skipped}`);
    console.log(`========================================\n`);

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAllSingers();
