# Cheatsheet Manager - Project Planning

## Project Overview
A frontend-only web application that helps content creators generate exam content (MCQs, descriptive questions) using cheatsheets stored locally in a JSON file.

## Architecture

### Technology Stack
- **Framework**: React 18+ with Vite
- **Language**: TypeScript (for type safety)
- **Styling**: CSS Modules or Tailwind CSS (for clean, maintainable styles)
- **State Management**: React Hooks (useState, useContext)
- **File Handling**: FileReader API for loading local JSON files

### Data Model
```
Course
  └── Module[]
      └── Unit[]
          └── Cheatsheet (one per unit, free-form text)
```

### File Structure
```
/
├── public/
│   └── data/
│       └── cheatsheets.json (example data file)
├── src/
│   ├── components/
│   │   ├── CourseSelector.tsx
│   │   ├── ModuleSelector.tsx
│   │   ├── UnitSelector.tsx
│   │   ├── CheatsheetViewer.tsx
│   │   ├── PromptTemplates.tsx
│   │   └── FileLoader.tsx
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   ├── utils/
│   │   ├── cheatsheetCollector.ts (core logic)
│   │   └── promptTemplates.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Core Logic

#### Cheatsheet Collection Algorithm
When a unit is selected:
1. Find the selected course
2. Iterate through all modules in order
3. For each module, iterate through all units in order
4. Collect cheatsheets until reaching the selected unit (inclusive)
5. Combine all cheatsheets into a single string

### Key Components

1. **FileLoader**: Allows users to load/select the local JSON file
2. **CourseSelector**: Dropdown/select for choosing a course
3. **ModuleSelector**: Dropdown/select for choosing a module (filtered by course)
4. **UnitSelector**: Dropdown/select for choosing a unit (filtered by module)
5. **CheatsheetViewer**: Displays the combined cheatsheet content
6. **PromptTemplates**: Provides templates for MCQ and descriptive question generation

### Design Principles
- **Simplicity**: Clean, intuitive UI that non-technical users can navigate
- **Maintainability**: Well-structured code with clear separation of concerns
- **Scalability**: Easy to add new courses/modules/units without code changes
- **No Dependencies**: Minimal external dependencies, pure frontend solution

### Data Flow
1. User loads JSON file → FileLoader reads and parses
2. User selects Course → Filters available modules
3. User selects Module → Filters available units
4. User selects Unit → Triggers cheatsheet collection
5. Combined cheatsheet displayed → Available for prompt generation

## Constraints
- Frontend only (no backend, no database, no APIs)
- Data stored in single local JSON file
- No authentication required
- Cheatsheets are editable via the JSON file




