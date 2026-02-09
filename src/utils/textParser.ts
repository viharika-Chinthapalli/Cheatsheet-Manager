/**
 * Parser utility for converting text-based cheatsheet format to structured data.
 * 
 * Supports two formats:
 * 
 * Format 1 (Explicit):
 * course name: [Course Name]
 * module name[number]: [Module Name]
 * unit name [number]: [Unit Name]
 * [Cheatsheet content follows until next unit/module/course]
 * 
 * Format 2 (Markdown):
 * <Section>
 * ## [Unit Name]
 * [Cheatsheet content]
 * ## [Another Unit Name]
 * [More content]
 * </Section>
 * 
 * Markdown headers (##) are treated as units. Content between headers becomes the cheatsheet.
 */

import { CheatsheetData, Course, Module, Unit } from '../types';

interface ParseResult {
  success: boolean;
  data?: CheatsheetData;
  error?: string;
}

/**
 * Parses text content into structured CheatsheetData.
 *
 * Args:
 *   text: The raw text content to parse.
 *
 * Returns:
 *   ParseResult with success status and parsed data or error message.
 */
export function parseCheatsheetText(text: string): ParseResult {
  if (!text || text.trim().length === 0) {
    return { success: false, error: 'Text content is empty' };
  }

  const lines = text.split('\n');
  const courses: Course[] = [];
  
  let currentCourse: Course | null = null;
  let currentModule: Module | null = null;
  let currentUnit: Unit | null = null;
  let currentCheatsheetLines: string[] = [];
  let courseCounter = 0;
  let moduleCounter = 0;
  let unitCounter = 0;
  let inSection = false;
  let isMarkdownFormat = false;

  // Patterns to match
  const coursePattern = /^course\s+name\s*:\s*(.+)$/i;
  const modulePattern = /^module\s+name\s*(\d+)?\s*:\s*(.+)$/i;
  const unitPattern = /^unit\s+name\s*(\d+)?\s*:\s*(.+)$/i;
  
  // Markdown patterns
  const sectionStartPattern = /^<Section>/i;
  const sectionEndPattern = /^<\/Section>/i;
  const markdownHeader2Pattern = /^##\s+(.+)$/; // ## Header
  const markdownHeader3Pattern = /^###\s+(.+)$/; // ### Header
  const markdownHeader4Pattern = /^####\s+(.+)$/; // #### Header

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const line = originalLine.trim();
    
    // Skip empty lines (but preserve them in cheatsheet content)
    if (line === '') {
      if (currentUnit) {
        currentCheatsheetLines.push('');
      }
      continue;
    }

    // Check for Section tags (markdown format indicator)
    if (sectionStartPattern.test(line)) {
      inSection = true;
      isMarkdownFormat = true;
      // If no course exists, create a default course
      if (!currentCourse) {
        courseCounter++;
        currentCourse = {
          id: `course-${courseCounter}`,
          name: 'Default Course',
          modules: [],
        };
      }
      // Create a default module if none exists
      if (!currentModule) {
        moduleCounter++;
        currentModule = {
          id: `module-${moduleCounter}`,
          name: 'Default Module',
          units: [],
        };
        if (currentCourse) {
          currentCourse.modules.push(currentModule);
        }
      }
      continue;
    }

    if (sectionEndPattern.test(line)) {
      inSection = false;
      continue;
    }

    // Check for markdown headers (only if we're in markdown format or detected markdown)
    if (isMarkdownFormat || markdownHeader2Pattern.test(line)) {
      isMarkdownFormat = true;
      
      // Markdown ## headers are treated as units
      const header2Match = line.match(markdownHeader2Pattern);
      if (header2Match) {
        // Save previous unit if exists
        if (currentUnit) {
          currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
          if (currentModule) {
            currentModule.units.push(currentUnit);
          }
          currentCheatsheetLines = [];
        }

        // Start new unit from ## header
        unitCounter++;
        currentUnit = {
          id: `unit-${unitCounter}`,
          name: header2Match[1].trim(),
          cheatsheet: '',
        };
        
        // Ensure we have course and module
        if (!currentCourse) {
          courseCounter++;
          currentCourse = {
            id: `course-${courseCounter}`,
            name: 'Default Course',
            modules: [],
          };
        }
        if (!currentModule) {
          moduleCounter++;
          currentModule = {
            id: `module-${moduleCounter}`,
            name: 'Default Module',
            units: [],
          };
          currentCourse.modules.push(currentModule);
        }
        continue;
      }
      
      // Markdown ### and #### headers are part of content (subsections)
      // They're included in the cheatsheet content
      if (markdownHeader3Pattern.test(line) || markdownHeader4Pattern.test(line)) {
        if (currentUnit) {
          currentCheatsheetLines.push(originalLine);
        }
        continue;
      }
    }

    // Check for course name (explicit format)
    const courseMatch = line.match(coursePattern);
    if (courseMatch) {
      // Save previous unit/module/course if exists
      if (currentUnit) {
        currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
        currentModule!.units.push(currentUnit);
        currentCheatsheetLines = [];
        currentUnit = null;
      }
      if (currentModule) {
        currentCourse!.modules.push(currentModule);
        currentModule = null;
      }
      if (currentCourse) {
        courses.push(currentCourse);
      }

      // Start new course
      courseCounter++;
      currentCourse = {
        id: `course-${courseCounter}`,
        name: courseMatch[1].trim(),
        modules: [],
      };
      continue;
    }

    // Check for module name
    const moduleMatch = line.match(modulePattern);
    if (moduleMatch) {
      // Save previous unit/module if exists
      if (currentUnit) {
        currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
        currentModule!.units.push(currentUnit);
        currentCheatsheetLines = [];
        currentUnit = null;
      }
      if (currentModule) {
        currentCourse!.modules.push(currentModule);
        currentModule = null;
      }

      // Start new module
      moduleCounter++;
      currentModule = {
        id: `module-${moduleCounter}`,
        name: moduleMatch[2].trim(),
        units: [],
      };
      continue;
    }

    // Check for unit name
    const unitMatch = line.match(unitPattern);
    if (unitMatch) {
      // Save previous unit if exists
      if (currentUnit) {
        currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
        currentModule!.units.push(currentUnit);
        currentCheatsheetLines = [];
      }

      // Start new unit
      unitCounter++;
      currentUnit = {
        id: `unit-${unitCounter}`,
        name: unitMatch[2].trim(),
        cheatsheet: '',
      };
      continue;
    }

    // If we have a current unit, this line is part of the cheatsheet content
    if (currentUnit) {
      currentCheatsheetLines.push(originalLine); // Use original line to preserve formatting
    } else if (currentModule && !currentUnit) {
      // If we have a module but no unit yet, this might be content before first unit
      // We'll create a default unit for it
      unitCounter++;
      currentUnit = {
        id: `unit-${unitCounter}`,
        name: 'Default Unit',
        cheatsheet: '',
      };
      currentCheatsheetLines.push(originalLine);
    } else if (isMarkdownFormat) {
      // In markdown format, content before first ## header goes to a default unit
      if (!currentUnit) {
        unitCounter++;
        currentUnit = {
          id: `unit-${unitCounter}`,
          name: 'Introduction',
          cheatsheet: '',
        };
        if (!currentModule) {
          moduleCounter++;
          currentModule = {
            id: `module-${moduleCounter}`,
            name: 'Default Module',
            units: [],
          };
        }
        if (!currentCourse) {
          courseCounter++;
          currentCourse = {
            id: `course-${courseCounter}`,
            name: 'Default Course',
            modules: [],
          };
        }
        if (currentModule && currentCourse) {
          currentCourse.modules.push(currentModule);
        }
      }
      currentCheatsheetLines.push(originalLine);
    } else if (!currentCourse) {
      // Content before any course declaration - try to detect format or create default
      // Check if it looks like markdown
      if (markdownHeader2Pattern.test(line)) {
        isMarkdownFormat = true;
        // Will be handled in next iteration
        i--; // Re-process this line
        continue;
      }
      return { 
        success: false, 
        error: 'No course found. Please start with "course name: [Course Name]" or use markdown headers (##)' 
      };
    }
  }

  // Save the last unit/module/course
  if (currentUnit) {
    currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
    if (currentModule) {
      // Check if unit is not already added
      if (!currentModule.units.includes(currentUnit)) {
        currentModule.units.push(currentUnit);
      }
    }
  }
  if (currentModule && currentCourse) {
    // Check if module is not already added
    if (!currentCourse.modules.includes(currentModule)) {
      currentCourse.modules.push(currentModule);
    }
  }
  if (currentCourse && !courses.includes(currentCourse)) {
    courses.push(currentCourse);
  }

  // For markdown format, ensure we have at least one unit
  if (isMarkdownFormat && currentUnit && currentUnit.cheatsheet.trim().length === 0 && currentCheatsheetLines.length > 0) {
    currentUnit.cheatsheet = currentCheatsheetLines.join('\n').trim();
  }

  // Validate that we have at least one course
  if (courses.length === 0 && !currentCourse) {
    return { 
      success: false, 
      error: 'No valid course found. Please check your format. Use "course name: [Name]" or markdown headers (##).' 
    };
  }

  // Validate that all courses have modules and units
  const allCourses = courses;
  
  for (const course of allCourses) {
    if (course.modules.length === 0) {
      // For markdown format, this might be okay if we have units in a default module
      if (!isMarkdownFormat) {
        return { 
          success: false, 
          error: `Course "${course.name}" has no modules.` 
        };
      }
    }
    for (const module of course.modules) {
      if (module.units.length === 0) {
        return { 
          success: false, 
          error: `Module "${module.name}" in course "${course.name}" has no units.` 
        };
      }
      for (const unit of module.units) {
        if (!unit.cheatsheet || unit.cheatsheet.trim().length === 0) {
          return { 
            success: false, 
            error: `Unit "${unit.name}" in module "${module.name}" has no cheatsheet content.` 
          };
        }
      }
    }
  }
  
  // Update courses array if we have a current course not yet added
  if (currentCourse && !courses.includes(currentCourse)) {
    courses.push(currentCourse);
  }

  return {
    success: true,
    data: { courses },
  };
}

/**
 * Example format helper - returns example text format.
 *
 * Returns:
 *   Example text showing the expected format.
 */
export function getExampleFormat(): string {
  return `Format 1 (Explicit):
course name: Build Your Own Static Website
module name1: Introduction to HTML
unit name 1: Introduction to GenAI in Frontend Development
This is the cheatsheet content for the first unit.
It can span multiple lines.
You can include any text here.

unit name 2: Introduction to HTML
This is the cheatsheet content for the second unit.
More content here.

module name2: Introduction to CSS
unit name 1: Leveraging Gen AI for accelerated learning
Cheatsheet content for CSS unit 1.

---

Format 2 (Markdown - Alternative):
<Section>
## Introduction
AI is revolutionizing the way we build websites...

## 1. Introduction to GenAI in Frontend Development
### 1.1. Static Website
A static website is an application that contains fixed content...

### 1.2. Developing a Web Application
Content about web development...

## 2. More Examples
Below are exercises where you can use AI tools...
</Section>`;
}

