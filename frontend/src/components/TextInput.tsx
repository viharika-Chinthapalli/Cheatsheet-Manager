/**
 * Component for manual entry of cheatsheet content.
 */

import { useState } from 'react';
import { CheatsheetData } from '../types';
import { mergeCheatsheetData, saveCheatsheetData, loadCheatsheetData } from '../utils/storage';

interface TextInputProps {
  onDataLoaded: (data: CheatsheetData) => void;
}

/**
 * TextInput component allows users to manually enter course, module, unit names and content.
 *
 * Args:
 *   onDataLoaded: Callback function called when data is successfully loaded.
 */
export function TextInput({ onDataLoaded }: TextInputProps) {
  const [error, setError] = useState<string | null>(null);
  
  // Manual entry fields
  const [courseName, setCourseName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [text, setText] = useState('');
  const [manualUnits, setManualUnits] = useState<Array<{
    courseName: string;
    moduleName: string;
    unitName: string;
    content: string;
  }>>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  };
  const handleAddUnit = () => {
    if (!courseName.trim() || !moduleName.trim() || !unitName.trim() || !text.trim()) {
      setError('Please fill in all fields: Course Name, Module Name, Unit Name, and Content');
      return;
    }

    const newUnit = {
      courseName: courseName.trim(),
      moduleName: moduleName.trim(),
      unitName: unitName.trim(),
      content: text.trim(),
    };

    setManualUnits([...manualUnits, newUnit]);
    setText('');
    setUnitName('');
    setError(null);
  };

    const handleLoadManual = async () => {
      if (manualUnits.length === 0) {
        setError('Please add at least one unit before loading');
        return;
      }

      const unitsCount = manualUnits.length;

      // Build structured data from manual entries
      const coursesMap = new Map<string, {
        name: string;
        modules: Map<string, {
          name: string;
          units: Array<{
            name: string;
            cheatsheet: string;
          }>;
        }>;
      }>();

      manualUnits.forEach((unit) => {
        // Get or create course
        if (!coursesMap.has(unit.courseName)) {
          coursesMap.set(unit.courseName, {
            name: unit.courseName,
            modules: new Map(),
          });
        }
        const course = coursesMap.get(unit.courseName)!;

        // Get or create module
        if (!course.modules.has(unit.moduleName)) {
          course.modules.set(unit.moduleName, {
            name: unit.moduleName,
            units: [],
          });
        }
        const module = course.modules.get(unit.moduleName)!;

        // Add unit (append to existing units in this module)
        module.units.push({
          name: unit.unitName,
          cheatsheet: unit.content,
        });
      });

      // Convert to CheatsheetData format (without IDs)
      const newData: CheatsheetData = {
        courses: Array.from(coursesMap.values()).map((course) => ({
          name: course.name,
          modules: Array.from(course.modules.values()).map((module) => ({
            name: module.name,
            units: module.units,
          })),
        })),
      };

      // Load existing data from file
      const existingData = await loadCheatsheetData();
      
      // Merge with existing data (appends new units to existing courses/modules)
      const mergedData = mergeCheatsheetData(existingData || { courses: [] }, newData);
      
      // Save merged data directly to file (exports JSON)
      await saveCheatsheetData(mergedData);
      
      // Clear the form
      setManualUnits([]);
      setCourseName('');
      setModuleName('');
      setUnitName('');
      setText('');
      setError(null);
      
      // Show success message
      alert(`✅ ${unitsCount} unit(s) added successfully!\n\n📁 Cheatsheets saved to backend.\n\n💡 You can add more units to any module anytime - they will be automatically appended!`);
      
      // Notify parent
      onDataLoaded(mergedData);
    };

  const handleClearManual = () => {
    setManualUnits([]);
    setCourseName('');
    setModuleName('');
    setUnitName('');
    setText('');
    setError(null);
  };

  const handleRemoveUnit = (index: number) => {
    setManualUnits(manualUnits.filter((_, i) => i !== index));
  };

  return (
    <div className="text-input">
      <div className="text-input-header">
        <h2>Enter Cheatsheet Content</h2>
      </div>

      <div className="manual-entry-form">
        <div className="manual-entry-fields">
          <div className="manual-field">
            <label htmlFor="course-name-input">Course Name:</label>
            <input
              id="course-name-input"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Build Your Own Static Website"
              className="manual-input"
            />
          </div>
          <div className="manual-field">
            <label htmlFor="module-name-input">Module Name:</label>
            <input
              id="module-name-input"
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="e.g., Introduction to HTML"
              className="manual-input"
            />
          </div>
          <div className="manual-field">
            <label htmlFor="unit-name-input">Unit Name:</label>
            <input
              id="unit-name-input"
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="e.g., Introduction to GenAI in Frontend Development"
              className="manual-input"
            />
          </div>
        </div>
        
        {manualUnits.length > 0 && (
          <div className="manual-units-list">
            <h4>Added Units ({manualUnits.length}):</h4>
            <div className="units-list">
              {manualUnits.map((unit, index) => (
                <div key={index} className="unit-item">
                  <span className="unit-path">
                    {unit.courseName} → {unit.moduleName} → {unit.unitName}
                  </span>
                  <button
                    onClick={() => handleRemoveUnit(index)}
                    className="remove-unit-button"
                    title="Remove unit"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="textarea-container">
        <label htmlFor="content-textarea" className="textarea-label">
          Unit Content:
        </label>
        <textarea
          id="content-textarea"
          value={text}
          onChange={handleTextChange}
          placeholder="Paste the content for this unit..."
          className="text-input-textarea"
          rows={15}
        />
      </div>

      {error && (
        <div className="text-input-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="text-input-footer">
        <button onClick={handleClearManual} className="text-input-button">
          Clear All
        </button>
        <button onClick={handleAddUnit} className="text-input-button secondary">
          Add Unit
        </button>
        <button onClick={handleLoadManual} className="text-input-button primary">
          Load ({manualUnits.length} units)
        </button>
      </div>
    </div>
  );
}


