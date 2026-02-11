/**
 * Type definitions for the Cheatsheet Manager application.
 */

export interface Unit {
  name: string;
  cheatsheet: string;
}

export interface Module {
  name: string;
  units: Unit[];
}

export interface Course {
  name: string;
  modules: Module[];
}

export interface CheatsheetData {
  courses: Course[];
}

export interface SelectionState {
  courseName: string | null;
  moduleName: string | null;
  unitName: string | null;
}


