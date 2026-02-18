/**
 * Core utility functions for collecting cheatsheets.
 */

import { CheatsheetData } from '../types';

/**
 * Collects all cheatsheets from the beginning of a course up to and including the selected unit.
 *
 * Args:
 *   data: The complete cheatsheet data structure.
 *   courseName: Name of the selected course.
 *   moduleName: Name of the selected module.
 *   unitName: Name of the selected unit.
 *
 * Returns:
 *   Combined cheatsheet content as a single string, or empty string if selection is invalid.
 */
export function collectCheatsheetsUpToUnit(
  data: CheatsheetData,
  courseName: string,
  moduleName: string,
  unitName: string
): string {
  const course = data.courses.find((c) => c.name === courseName);
  if (!course) {
    return '';
  }

  const collectedCheatsheets: string[] = [];
  let foundSelectedUnit = false;

  // Iterate through all modules in order
  for (const module of course.modules) {
    // Iterate through all units in the module
    for (const unit of module.units) {
      // Add this unit's cheatsheet
      collectedCheatsheets.push(unit.cheatsheet);

      // Check if this is the selected unit
      if (module.name === moduleName && unit.name === unitName) {
        foundSelectedUnit = true;
        break;
      }
    }

    // If we found the selected unit, stop iterating
    if (foundSelectedUnit) {
      break;
    }
  }

  // If the selected unit wasn't found, return empty string
  if (!foundSelectedUnit) {
    return '';
  }

  // Combine all cheatsheets with clear separators
  return collectedCheatsheets.join('\n\n---\n\n');
}

/**
 * Gets a formatted string with unit names and their cheatsheets.
 *
 * Args:
 *   data: The complete cheatsheet data structure.
 *   courseName: Name of the selected course.
 *   moduleName: Name of the selected module.
 *   unitName: Name of the selected unit.
 *
 * Returns:
 *   Formatted string with unit headers and cheatsheets.
 */
export function getFormattedCheatsheets(
  data: CheatsheetData,
  courseName: string,
  moduleName: string,
  unitName: string
): string {
  const course = data.courses.find((c) => c.name === courseName);
  if (!course) {
    return '';
  }

  const formattedParts: string[] = [];
  let foundSelectedUnit = false;

  for (const module of course.modules) {
    for (const unit of module.units) {
      formattedParts.push(`[${module.name} - ${unit.name}]\n${unit.cheatsheet}`);

      if (module.name === moduleName && unit.name === unitName) {
        foundSelectedUnit = true;
        break;
      }
    }

    if (foundSelectedUnit) {
      break;
    }
  }

  if (!foundSelectedUnit) {
    return '';
  }

  return formattedParts.join('\n\n---\n\n');
}

/**
 * Gets all units up to the selected unit with their metadata.
 *
 * Args:
 *   data: The complete cheatsheet data structure.
 *   courseName: Name of the selected course.
 *   moduleName: Name of the selected module.
 *   unitName: Name of the selected unit.
 *
 * Returns:
 *   Array of units with their module and unit names.
 */
export function getUnitsUpToSelected(
  data: CheatsheetData,
  courseName: string,
  moduleName: string,
  unitName: string
): Array<{ moduleName: string; unitName: string; cheatsheet: string }> {
  const course = data.courses.find((c) => c.name === courseName);
  if (!course) {
    return [];
  }

  const units: Array<{ moduleName: string; unitName: string; cheatsheet: string }> = [];
  let foundSelectedUnit = false;

  for (const module of course.modules) {
    for (const unit of module.units) {
      units.push({
        moduleName: module.name,
        unitName: unit.name,
        cheatsheet: unit.cheatsheet,
      });

      if (module.name === moduleName && unit.name === unitName) {
        foundSelectedUnit = true;
        break;
      }
    }

    if (foundSelectedUnit) {
      break;
    }
  }

  return foundSelectedUnit ? units : [];
}

/**
 * Returns only the cheatsheet for the selected unit (no cumulative content).
 *
 * Args:
 *   data: The complete cheatsheet data structure.
 *   courseName: Name of the selected course.
 *   moduleName: Name of the selected module.
 *   unitName: Name of the selected unit.
 *
 * Returns:
 *   The selected unit's cheatsheet text, or empty string if not found.
 */
export function getSingleUnitCheatsheet(
  data: CheatsheetData,
  courseName: string,
  moduleName: string,
  unitName: string
): string {
  const course = data.courses.find((c) => c.name === courseName);
  if (!course) {
    return '';
  }

  for (const module of course.modules) {
    if (module.name !== moduleName) continue;
    const unit = module.units.find((u) => u.name === unitName);
    if (unit) {
      return unit.cheatsheet;
    }
    break;
  }

  return '';
}
