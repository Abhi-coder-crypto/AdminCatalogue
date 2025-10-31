import mongoose from 'mongoose';
import { readFileSync } from 'fs';

const CONFIG_PATH = '.mongodb-config.json';

interface MongoDBConfig {
  celebrityMongoUri: string;
}

function loadConfig(): string {
  const data = readFileSync(CONFIG_PATH, 'utf-8');
  const config: MongoDBConfig = JSON.parse(data);
  return config.celebrityMongoUri;
}

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

async function removeFields() {
  try {
    const mongoUri = loadConfig();
    await mongoose.connect(mongoUri);
    console.log('Connected to celebrity database\n');

    const Celebrity = mongoose.model('Celebrity', celebritySchema);

    const result = await Celebrity.updateMany(
      { category: 'Singers' },
      { 
        $unset: { 
          priceRange: "",
          achievements: ""
        }
      }
    );

    console.log(`✓ Removed priceRange and achievements from ${result.modifiedCount} singers\n`);

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

removeFields();
