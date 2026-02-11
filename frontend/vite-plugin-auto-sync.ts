/**
 * Vite plugin to automatically sync cheatsheets.json and provide API endpoint for direct file writes.
 */

import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const PROJECT_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const PROJECT_JSON_FILE = path.join(PROJECT_DATA_DIR, 'cheatsheets.json');
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const DOWNLOADS_JSON_FILE = path.join(DOWNLOADS_DIR, 'cheatsheets.json');

function ensureDataDir() {
  if (!fs.existsSync(PROJECT_DATA_DIR)) {
    fs.mkdirSync(PROJECT_DATA_DIR, { recursive: true });
  }
}

function syncJsonFile() {
  try {
    ensureDataDir();

    // Check if file exists in Downloads
    if (fs.existsSync(DOWNLOADS_JSON_FILE)) {
      const stats = fs.statSync(DOWNLOADS_JSON_FILE);
      const projectStats = fs.existsSync(PROJECT_JSON_FILE) 
        ? fs.statSync(PROJECT_JSON_FILE) 
        : null;

      // Only sync if Downloads file is newer or project file doesn't exist
      if (!projectStats || stats.mtime > projectStats.mtime) {
        const data = fs.readFileSync(DOWNLOADS_JSON_FILE, 'utf8');
        fs.writeFileSync(PROJECT_JSON_FILE, data, 'utf8');
        console.log('✅ Auto-synced cheatsheets.json to public/data/');
      }
    }
  } catch (error) {
    // Silent fail - don't break dev server
    console.warn('Auto-sync warning:', error);
  }
}

function writeJsonFile(data: string) {
  try {
    ensureDataDir();
    fs.writeFileSync(PROJECT_JSON_FILE, data, 'utf8');
    console.log('✅ Directly updated cheatsheets.json in public/data/');
    return true;
  } catch (error) {
    console.error('❌ Error writing JSON file:', error);
    return false;
  }
}

export function autoSyncJson(): Plugin {
  return {
    name: 'auto-sync-json',
    buildStart() {
      syncJsonFile();
    },
    configureServer(server) {
      // API endpoint to write JSON file directly
      server.middlewares.use('/api/write-cheatsheets', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const jsonString = JSON.stringify(data, null, 2);
              const success = writeJsonFile(jsonString);
              
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = success ? 200 : 500;
              res.end(JSON.stringify({ success, message: success ? 'File updated successfully' : 'Failed to update file' }));
            } catch (error) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
            }
          });
        } else {
          next();
        }
      });

      // Watch Downloads folder for cheatsheets.json changes
      let watchInterval: NodeJS.Timeout | null = null;

      server.httpServer?.once('listening', () => {
        // Initial sync
        syncJsonFile();

        // Watch Downloads folder every 2 seconds
        watchInterval = setInterval(() => {
          syncJsonFile();
        }, 2000);
      });

      // Cleanup on close
      return () => {
        if (watchInterval) {
          clearInterval(watchInterval);
        }
      };
    },
  };
}


