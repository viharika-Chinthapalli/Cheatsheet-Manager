/**
 * Page component for viewing and selecting cheatsheets.
 */

import { useState, useEffect } from 'react';
import { CheatsheetData, SelectionState } from '../types';
import { collectCheatsheetsUpToUnit, getUnitsUpToSelected } from '../utils/cheatsheetCollector';
import { loadCheatsheetData } from '../utils/storage';
import { CourseSelector } from './CourseSelector';
import { ModuleSelector } from './ModuleSelector';
import { UnitSelector } from './UnitSelector';
import { CheatsheetViewer } from './CheatsheetViewer';
import { PromptTemplates } from './PromptTemplates';

interface ViewCheatsheetsPageProps {
  onNavigateToAdd: () => void;
  onDataUpdated: (data: CheatsheetData) => void;
}

/**
 * ViewCheatsheetsPage component for viewing and selecting cheatsheets.
 *
 * Args:
 *   onNavigateToAdd: Callback to navigate to add page.
 *   onDataUpdated: Callback when data is updated.
 */
export function ViewCheatsheetsPage({ onNavigateToAdd, onDataUpdated }: ViewCheatsheetsPageProps) {
  const [data, setData] = useState<CheatsheetData | null>(null);
  const [selection, setSelection] = useState<SelectionState>({
    courseName: null,
    moduleName: null,
    unitName: null,
  });

  useEffect(() => {
    // Load data from storage on mount
    const loadData = async () => {
      const storedData = await loadCheatsheetData();
      if (storedData) {
        setData(storedData);
        onDataUpdated(storedData);
      }
    };
    loadData();
  }, [onDataUpdated]);

  const handleCourseChange = (courseName: string) => {
    setSelection({ courseName, moduleName: null, unitName: null });
  };

  const handleModuleChange = (moduleName: string) => {
    setSelection({ ...selection, moduleName, unitName: null });
  };

  const handleUnitChange = (unitName: string) => {
    setSelection({ ...selection, unitName });
  };

  // Get current course
  const currentCourse = data?.courses.find((c) => c.name === selection.courseName);

  // Get modules for current course
  const availableModules = currentCourse?.modules || [];

  // Get units for current module
  const currentModule = currentCourse?.modules.find((m) => m.name === selection.moduleName);
  const availableUnits = currentModule?.units || [];

  // Get combined cheatsheet content
  let combinedContent = '';
  let unitCount = 0;
  if (data && selection.courseName && selection.moduleName && selection.unitName) {
    combinedContent = collectCheatsheetsUpToUnit(
      data,
      selection.courseName,
      selection.moduleName,
      selection.unitName
    );
    const units = getUnitsUpToSelected(
      data,
      selection.courseName,
      selection.moduleName,
      selection.unitName
    );
    unitCount = units.length;
  }

  if (!data || data.courses.length === 0) {
    return (
      <div className="view-page">
        <div className="page-header">
          <h2>View Cheatsheets</h2>
          <div className="page-actions">
            <button onClick={onNavigateToAdd} className="nav-button primary">
              Add Cheatsheets
            </button>
          </div>
        </div>
        <div className="empty-state">
          <p>No cheatsheets found. Add some cheatsheets to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-page">
      <div className="page-header">
        <h2>View Cheatsheets</h2>
        <div className="page-actions">
          <button onClick={onNavigateToAdd} className="nav-button primary">
            Add More Cheatsheets
          </button>
        </div>
      </div>

      <div className="app-selectors">
        <CourseSelector
          courses={data.courses}
          selectedCourseName={selection.courseName}
          onCourseChange={handleCourseChange}
        />
        <ModuleSelector
          modules={availableModules}
          selectedModuleName={selection.moduleName}
          onModuleChange={handleModuleChange}
          disabled={!selection.courseName}
        />
        <UnitSelector
          units={availableUnits}
          selectedUnitName={selection.unitName}
          onUnitChange={handleUnitChange}
          disabled={!selection.moduleName}
        />
      </div>

      <div className="app-content">
        <CheatsheetViewer content={combinedContent} unitCount={unitCount} />
        <PromptTemplates cheatsheetContent={combinedContent} />
      </div>
    </div>
  );
}

