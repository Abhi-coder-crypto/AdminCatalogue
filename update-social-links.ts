import mongoose from 'mongoose';
import { readFileSync } from 'fs';

const CONFIG_PATH = '.mongodb-config.json';
const SOCIAL_DATA_PATH = 'social-media-data.json';

interface MongoDBConfig {
  celebrityMongoUri: string;
}

interface SocialMediaData {
  singers: {
    [name: string]: {
      instagram: string;
      twitter: string;
      facebook: string;
    };
  };
}

function loadConfig(): string {
  const data = readFileSync(CONFIG_PATH, 'utf-8');
  const config: MongoDBConfig = JSON.parse(data);
  return config.celebrityMongoUri;
}

function loadSocialData(): SocialMediaData {
  const data = readFileSync(SOCIAL_DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

const celebritySchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  socialLinks: [String],
}, { timestamps: true });

async function updateSocialLinks() {
  try {
    const mongoUri = loadConfig();
    await mongoose.connect(mongoUri);
    console.log('Connected to celebrity database\n');

    const Celebrity = mongoose.model('Celebrity', celebritySchema);
    const socialData = loadSocialData();

    const singers = await Celebrity.find({ category: 'Singers' });
    console.log(`Found ${singers.length} singers in the database\n`);

    let updated = 0;
    let skipped = 0;

    for (const singer of singers) {
      const name = singer.get('name');
      const socialInfo = socialData.singers[name];

      if (socialInfo) {
        const socialLinks: string[] = [];
        
        if (socialInfo.instagram) socialLinks.push(socialInfo.instagram);
        if (socialInfo.twitter) socialLinks.push(socialInfo.twitter);
        if (socialInfo.facebook) socialLinks.push(socialInfo.facebook);

        if (socialLinks.length > 0) {
          await Celebrity.updateOne(
            { _id: singer._id },
            { $set: { socialLinks } }
          );
          console.log(`✓ Updated ${name}: ${socialLinks.length} links`);
          updated++;
        } else {
          console.log(`○ Skipped ${name}: No social links found`);
          skipped++;
        }
      } else {
        console.log(`⚠ Warning: No data found for ${name}`);
        skipped++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Total singers: ${singers.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`========================================\n`);

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateSocialLinks();
