/**
 * Storage utility for persisting cheatsheet data.
 * Works directly with JSON file in public/data/cheatsheets.json
 */

import { CheatsheetData } from '../types';

const JSON_FILE_PATH = '/data/cheatsheets.json';

/**
 * Saves cheatsheet data directly to public/data/cheatsheets.json.
 * Uses API endpoint when dev server is running, falls back to download otherwise.
 *
 * Args:
 *   data: The cheatsheet data to save.
 */
export async function saveCheatsheetData(data: CheatsheetData): Promise<void> {
  try {
    // Try to save directly via API (works when dev server is running)
    await autoExportToFile(data);
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Failed to save data.');
  }
}

/**
 * Saves data directly to public/data/cheatsheets.json via API.
 * Only works when dev server is running.
 *
 * Args:
 *   data: The cheatsheet data to save.
 */
async function autoExportToFile(data: CheatsheetData): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Write directly via API (requires dev server to be running)
    const response = await fetch('/api/write-cheatsheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });
    
    if (response.ok) {
      await response.json();
      console.log('✅ Cheatsheets saved directly to public/data/cheatsheets.json');
      return;
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save file');
    }
  } catch (error) {
    console.error('❌ Failed to save cheatsheets:', error);
    throw new Error('Failed to save cheatsheets. Make sure the dev server is running (npm run dev).');
  }
}

/**
 * Loads cheatsheet data from public JSON file.
 * Loads from public/data/cheatsheets.json
 *
 * Returns:
 *   The cheatsheet data, or null if no data exists.
 */
export async function loadCheatsheetData(): Promise<CheatsheetData | null> {
  try {
    const response = await fetch(JSON_FILE_PATH);
    if (response.ok) {
      const data: CheatsheetData = await response.json();
      return data;
    }
    // File doesn't exist - return empty data structure
    return { courses: [] };
  } catch (error) {
    console.log('Could not load from JSON file:', error);
    // Return empty data structure if file doesn't exist
    return { courses: [] };
  }
}

/**
 * Synchronous version - tries to load from file but returns empty if not available.
 * For immediate access, use the async version.
 *
 * Returns:
 *   The cheatsheet data, or empty structure if file not loaded yet.
 */
export function loadCheatsheetDataSync(): CheatsheetData {
  // Since we can't do async in sync function, return empty structure
  // Components should use async loadCheatsheetData() instead
  return { courses: [] };
}

/**
 * Adds new courses to existing data, merging with existing courses.
 * This function merges new data with existing data.
 *
 * Args:
 *   existingData: Existing cheatsheet data.
 *   newData: New cheatsheet data to add.
 *
 * Returns:
 *   Merged cheatsheet data.
 */
export function mergeCheatsheetData(existingData: CheatsheetData, newData: CheatsheetData): CheatsheetData {
  if (!existingData || !existingData.courses || existingData.courses.length === 0) {
    return newData;
  }

  // Merge courses - if course name exists, merge modules; otherwise add new course
  const existingCourses = new Map(
    existingData.courses.map(course => [course.name, course])
  );

  newData.courses.forEach(newCourse => {
    const existingCourse = existingCourses.get(newCourse.name);
    
    if (existingCourse) {
      // Course exists - merge modules
      const existingModules = new Map(
        existingCourse.modules.map(module => [module.name, module])
      );

      newCourse.modules.forEach(newModule => {
        const existingModule = existingModules.get(newModule.name);
        
        if (existingModule) {
          // Module exists - merge units
          const existingUnits = new Map(
            existingModule.units.map(unit => [unit.name, unit])
          );

          newModule.units.forEach(newUnit => {
            const existingUnit = existingUnits.get(newUnit.name);
            if (existingUnit) {
              // Unit exists - update cheatsheet
              existingUnit.cheatsheet = newUnit.cheatsheet;
            } else {
              // New unit - add it
              existingModule.units.push(newUnit);
            }
          });
        } else {
          // New module - add it
          existingCourse.modules.push(newModule);
        }
      });
    } else {
      // New course - add it
      existingData.courses.push(newCourse);
    }
  });

  return existingData;
}

/**
 * Exports cheatsheet data as a JSON file download.
 *
 * Args:
 *   data: The cheatsheet data to export.
 *   filename: Optional filename (default: 'cheatsheets.json').
 */
export function exportToFile(data: CheatsheetData, filename: string = 'cheatsheets.json'): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting file:', error);
    throw new Error('Failed to export file');
  }
}

/**
 * Imports cheatsheet data from a JSON file.
 *
 * Args:
 *   file: The file to import.
 *
 * Returns:
 *   Promise that resolves to the parsed cheatsheet data.
 */
export function importFromFile(file: File): Promise<CheatsheetData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: CheatsheetData = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Clears all stored cheatsheet data by exporting empty structure.
 */
export async function clearCheatsheetData(): Promise<void> {
  const emptyData: CheatsheetData = { courses: [] };
  await saveCheatsheetData(emptyData);
}


