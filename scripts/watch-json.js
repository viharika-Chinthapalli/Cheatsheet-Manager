/**
 * Watch script to automatically sync cheatsheets.json when it's downloaded.
 * Run this in a separate terminal: npm run watch-json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const PROJECT_JSON_FILE = path.join(PROJECT_DATA_DIR, 'cheatsheets.json');
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const DOWNLOADS_JSON_FILE = path.join(DOWNLOADS_DIR, 'cheatsheets.json');

// Ensure data directory exists
if (!fs.existsSync(PROJECT_DATA_DIR)) {
  fs.mkdirSync(PROJECT_DATA_DIR, { recursive: true });
}

/**
 * Syncs the JSON file from Downloads to project.
 */
function syncFile() {
  if (fs.existsSync(DOWNLOADS_JSON_FILE)) {
    try {
      const data = fs.readFileSync(DOWNLOADS_JSON_FILE, 'utf8');
      // Validate JSON
      JSON.parse(data);
      fs.writeFileSync(PROJECT_JSON_FILE, data, 'utf8');
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Synced cheatsheets.json to public/data/`);
    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error syncing:`, error.message);
    }
  }
}

// Initial sync
syncFile();
console.log('👀 Watching for cheatsheets.json in Downloads folder...');
console.log('   Press Ctrl+C to stop\n');

// Watch Downloads folder for cheatsheets.json
try {
  fs.watchFile(DOWNLOADS_JSON_FILE, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      syncFile();
    }
  });
} catch (error) {
  console.error('❌ Error setting up file watcher:', error.message);
  console.log('💡 Make sure cheatsheets.json exists in Downloads folder first.');
}



