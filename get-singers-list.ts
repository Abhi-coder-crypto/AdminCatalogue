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
  socialLinks: [String],
}, { timestamps: true });

async function getSingersList() {
  try {
    const mongoUri = loadConfig();
    await mongoose.connect(mongoUri);

    const Celebrity = mongoose.model('Celebrity', celebritySchema);
    const singers = await Celebrity.find({ category: 'Singers' }).select('name socialLinks').sort({ name: 1 });

    console.log('All 78 Singers:\n');
    singers.forEach((singer, index) => {
      console.log(`${index + 1}. ${singer.get('name')} - Current links: ${singer.get('socialLinks')?.length || 0}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getSingersList();
