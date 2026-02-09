# Cheatsheets Data Directory

## Purpose
This directory stores the `cheatsheets.json` file that contains all your cheatsheet data.

## Automatic File Management

The `cheatsheets.json` file is automatically maintained in this directory:

### Quick Start

**Option 1: One-time Sync**
```bash
npm run sync-json
```

**Option 2: Auto-Sync (Recommended)**
```bash
npm run watch-json
```
Run this in a separate terminal to automatically sync whenever you save cheatsheets.

### How It Works

1. **Save Data**: When you add cheatsheets, `cheatsheets.json` downloads to Downloads folder
2. **Auto-Sync**: The watch script automatically copies it to `public/data/cheatsheets.json`
3. **Auto-Load**: Application loads from this file on startup

## File Format

The JSON file follows this structure:

```json
{
  "courses": [
    {
      "name": "Course Name",
      "modules": [
        {
          "name": "Module Name",
          "units": [
            {
              "name": "Unit Name",
              "cheatsheet": "Cheatsheet content here..."
            }
          ]
        }
      ]
    }
  ]
}
```

## Benefits

- ✅ **Always in Project**: File is part of your project structure
- ✅ **Version Controlled**: Included in Git (not ignored)
- ✅ **Auto-Synced**: Automatically updated when you save
- ✅ **Cross-Device**: Works across different laptops/devices
- ✅ **Team Sharing**: Can be shared with team members via Git
- ✅ **Deployment**: Included automatically when you build/deploy

## File Location

- **Project Path**: `public/data/cheatsheets.json` ← **This is your main file**
- **Downloads**: Temporary location (auto-synced to project)
- **Git**: File is version controlled and shared

## Notes

- The file is automatically synced to this directory
- You can manually edit the JSON file if needed
- The application will merge imported data with existing data
- File is included in Git for version control

