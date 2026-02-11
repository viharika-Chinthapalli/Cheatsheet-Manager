/**
 * Script to sync cheatsheets.json from Downloads to project folder.
 * This ensures the JSON file is always in the project structure.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const PROJECT_JSON_FILE = path.join(PROJECT_DATA_DIR, 'cheatsheets.json');
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const DOWNLOADS_JSON_FILE = path.join(DOWNLOADS_DIR, 'cheatsheets.json');

/**
 * Syncs cheatsheets.json from Downloads to project folder.
 */
function syncJsonFile() {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(PROJECT_DATA_DIR)) {
      fs.mkdirSync(PROJECT_DATA_DIR, { recursive: true });
      console.log('✅ Created public/data directory');
    }

    // Check if file exists in Downloads
    if (fs.existsSync(DOWNLOADS_JSON_FILE)) {
      // Copy from Downloads to project
      const data = fs.readFileSync(DOWNLOADS_JSON_FILE, 'utf8');
      fs.writeFileSync(PROJECT_JSON_FILE, data, 'utf8');
      console.log('✅ Synced cheatsheets.json from Downloads to public/data/');
      console.log(`   Source: ${DOWNLOADS_JSON_FILE}`);
      console.log(`   Destination: ${PROJECT_JSON_FILE}`);
    } else if (fs.existsSync(PROJECT_JSON_FILE)) {
      console.log('ℹ️  cheatsheets.json already exists in public/data/');
      console.log(`   Location: ${PROJECT_JSON_FILE}`);
    } else {
      // Create empty file if neither exists
      const emptyData = {
        courses: []
      };
      fs.writeFileSync(PROJECT_JSON_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
      console.log('✅ Created empty cheatsheets.json in public/data/');
    }

    console.log('\n📁 File location: public/data/cheatsheets.json');
    console.log('💡 This file will be included when you build/deploy the application.');
  } catch (error) {
    console.error('❌ Error syncing JSON file:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncJsonFile();


