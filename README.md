# Cheatsheet Manager

A frontend-only web application that helps content creators generate exam content (MCQs, descriptive questions) using cheatsheets pasted directly into the application.

## Features

- **Hierarchical Data Structure**: Organize content as Course → Module → Unit → Cheatsheet
- **Progressive Cheatsheet Collection**: Automatically collects all cheatsheets from the beginning of a course up to the selected unit
- **Clean UI**: Intuitive interface for non-technical users
- **Prompt Generation**: Built-in templates for generating MCQs, descriptive questions, and complete exam papers
- **No Backend Required**: Pure frontend application - just paste and go
- **Text-Based Input**: Simple text format - no JSON knowledge required
- **Automatic JSON Export**: Data is automatically exported to `cheatsheets.json` file whenever you save
- **Persistent Storage**: Place the JSON file in `public/data/` folder for cross-device persistence

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### 1. Prepare Your Content

Paste your cheatsheet content directly into the text area. Use this format:

```
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

unit name 2: Introduction to CSS | Part-1
Cheatsheet content for CSS unit 2 part 1.

unit name 3: Introduction to CSS | Part-2
Cheatsheet content for CSS unit 2 part 2.
```

**Format Rules:**
- Start with `course name: [Course Name]`
- Use `module name[number]: [Module Name]` (numbers are optional)
- Use `unit name [number]: [Unit Name]` (numbers are optional)
- Content after each unit name becomes that unit's cheatsheet
- Content continues until the next unit/module/course declaration
- Empty lines are preserved in cheatsheet content

### 2. Load Your Data

1. Paste your cheatsheet content into the text area
2. Click "Parse & Load" button
3. The application will parse and structure your data
4. If there are errors, they will be displayed with helpful messages

### 3. Select Course, Module, and Unit

1. **Select a Course**: Choose from the dropdown
2. **Select a Module**: Choose a module within the selected course
3. **Select a Unit**: Choose a unit within the selected module

### 4. View Combined Cheatsheets

Once a unit is selected, the application automatically:
- Collects all cheatsheets from the beginning of the course
- Includes all previous modules
- Includes all previous units in the same module
- Includes the selected unit itself
- Displays the combined content

You can copy the combined cheatsheet content to your clipboard using the "Copy to Clipboard" button.

### 5. Generate Question Prompts

Use the prompt templates to generate prompts for AI tools (like ChatGPT):

- **Generate MCQ Prompt**: Creates a prompt for generating multiple-choice questions
- **Generate Descriptive Question Prompt**: Creates a prompt for generating long-form questions
- **Generate Complete Exam Paper Prompt**: Creates a prompt for generating a full exam paper

The prompts are automatically copied to your clipboard and can be pasted into your preferred AI tool.

## Project Structure

```
/
├── public/
│   └── data/
│       └── cheatsheets.json          # Example data file
├── src/
│   ├── components/
│   │   ├── TextInput.tsx             # Text input and parsing component
│   │   ├── CourseSelector.tsx        # Course selection dropdown
│   │   ├── ModuleSelector.tsx        # Module selection dropdown
│   │   ├── UnitSelector.tsx          # Unit selection dropdown
│   │   ├── CheatsheetViewer.tsx      # Combined cheatsheet display
│   │   └── PromptTemplates.tsx       # Prompt generation UI
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── utils/
│   │   ├── cheatsheetCollector.ts    # Core cheatsheet collection logic
│   │   ├── textParser.ts              # Text format parser
│   │   └── promptTemplates.ts        # Prompt template generators
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── package.json
├── vite.config.ts
└── README.md
```

## How It Works

### Cheatsheet Collection Algorithm

When you select a unit, the application:

1. Finds the selected course
2. Iterates through all modules in order
3. For each module, iterates through all units in order
4. Collects cheatsheets until reaching the selected unit (inclusive)
5. Combines all cheatsheets into a single string

**Example:**
If you select:
- Course: "Introduction to Computer Science"
- Module: "Data Structures" (Module 2)
- Unit: "Dictionaries" (Unit 2 in Module 2)

The application will collect cheatsheets from:
- Module 1, Unit 1
- Module 1, Unit 2
- Module 1, Unit 3
- Module 2, Unit 1
- Module 2, Unit 2 (selected unit)

### Prompt Templates

The application includes three types of prompt templates:

1. **MCQ Prompt**: Generates prompts for creating multiple-choice questions with configurable difficulty and quantity
2. **Descriptive Question Prompt**: Generates prompts for creating long-form questions with different types (definition, explanation, application, analysis)
3. **Exam Paper Prompt**: Generates prompts for creating complete exam papers with MCQs and descriptive questions

## Customization

### Styling

Edit `src/index.css` to customize the appearance of the application.

### Prompt Templates

Modify the functions in `src/utils/promptTemplates.ts` to customize the prompt generation logic.

### Text Parser

Modify the parser in `src/utils/textParser.ts` to adjust how text content is parsed into the data structure.

### Data Structure

The data structure is defined in `src/types/index.ts`. You can extend these types if needed.

## Data Storage & Persistence

### Automatic JSON File Storage

The application automatically maintains `cheatsheets.json` in your project folder:

1. **On Save**: When you add cheatsheets, `cheatsheets.json` is downloaded to Downloads folder
2. **Auto-Sync**: The Vite dev server automatically syncs it to `public/data/cheatsheets.json` (no manual steps needed!)
3. **File Location**: `public/data/cheatsheets.json` (automatically updated in your project)

### How It Works

- **During Development**: When you run `npm run dev`, the Vite plugin automatically watches for `cheatsheets.json` in Downloads and syncs it to `public/data/`
- **No Manual Steps**: Just add cheatsheets - the file is automatically updated in your project folder
- **File Persistence**: The JSON file is always in your project structure and included when you deploy

### File Structure

```
Cheatsheet-Manager/
├── public/
│   └── data/
│       └── cheatsheets.json  ← Your data file (version controlled)
├── scripts/
│   ├── sync-json.js          ← Manual sync script
│   └── watch-json.js         ← Auto-sync watcher
└── ...
```

### Benefits

- ✅ **Automatic**: JSON file is always in your project folder
- ✅ **Version Controlled**: File is included in Git (not in .gitignore)
- ✅ **Cross-Device**: Works across different laptops/devices
- ✅ **Team Sharing**: Can be shared with team members via Git
- ✅ **Backup**: File persists even if localStorage is cleared
- ✅ **Deployment**: Included automatically when you build/deploy

### How It Works

1. **Add Cheatsheets**: Enter data and click "Load"
2. **Auto-Download**: `cheatsheets.json` downloads to Downloads folder
3. **Auto-Sync**: Run `npm run watch-json` to automatically sync to project
4. **Auto-Load**: Application loads from `public/data/cheatsheets.json` on startup

### Notes

- The `cheatsheets.json` file in `public/data/` is **not** in `.gitignore`
- This allows you to version control your cheatsheets
- The file is included when you build/deploy the application
- You can manually edit the JSON file if needed

## Maintenance

### Adding New Content

1. Go to "Add Cheatsheets" page
2. Enter Course, Module, Unit names and content
3. Click "Add Unit" for each unit
4. Click "Load" to save (auto-exports JSON file)

**Adding Missing Cheatsheets Later:**
- You can add cheatsheets to any module at any time
- If you forgot to add a unit, just add it later with the same Course/Module name
- New units are automatically appended to existing modules
- Existing cheatsheets are preserved - nothing is overwritten

### Editing Cheatsheets

- **Via UI**: Use the "Add Cheatsheets" page to add/update units
- **Via JSON**: Manually edit `public/data/cheatsheets.json` if needed
- **Import**: Use "Import JSON" button to load from a file

## Technical Details

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: React Hooks (useState)
- **File Handling**: FileReader API
- **No External Dependencies**: Minimal dependencies for easy maintenance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is provided as-is for educational and content creation purposes.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

