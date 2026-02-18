# Task Log

## 2024-12-19 - Initial Application Build

### Main Task
Build a frontend-only web application for generating exam content from cheatsheets.

**Requirements:**
- Course → Module → Unit → Cheatsheet hierarchy
- Collect all cheatsheets from start to selected unit
- Display combined content for MCQ/descriptive question generation
- Single local JSON file storage
- Clean, maintainable UI for non-technical users

**Status**: Completed ✅

### Subtasks
- [x] Create project planning document
- [x] Create example JSON data structure
- [x] Set up React + Vite project
- [x] Build selection components (Course/Module/Unit)
- [x] Implement cheatsheet collection logic
- [x] Create cheatsheet viewer component
- [x] Add prompt templates for question generation
- [x] Create README with setup instructions

### Discovered During Work
_(Add any new requirements or issues discovered during development)_

---

## 2025-02-18 - View modes: up-to-unit and only-this-unit

### Main Task
Add two cheatsheet view options: (1) all cheatsheets from top to specified unit, (2) only the selected unit's cheatsheet.

**Status**: Completed ✅

### Subtasks
- [x] Add `getSingleUnitCheatsheet` in cheatsheetCollector.ts
- [x] Add view mode selector (radio) in View Cheatsheets page
- [x] Wire "All from start up to this unit" and "Only this unit" to content display
- [x] Style view-mode-selector in index.css
- [x] Update CheatsheetViewer header based on mode

---

## 2025-02-11 - Backend: MongoDB + Express + .env

### Main Task
Switch backend from file-based storage to MongoDB; use Express and `.env` for easy deployment.

**Status**: Completed ✅

### Subtasks
- [x] Add mongoose and dotenv to backend
- [x] Create Mongoose model (Course → Module → Unit → Cheatsheet)
- [x] Replace file I/O with MongoDB in index.js
- [x] Add .env.example (PORT, MONGODB_URI) and document .env usage
- [x] Update PLANNING.md and README

