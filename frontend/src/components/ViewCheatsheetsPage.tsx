/**
 * Page component for viewing and selecting cheatsheets.
 */

import { useState, useEffect } from 'react';
import { CheatsheetData, SelectionState } from '../types';
import {
  collectCheatsheetsUpToUnit,
  getUnitsUpToSelected,
  getSingleUnitCheatsheet,
} from '../utils/cheatsheetCollector';
import { loadCheatsheetData } from '../utils/storage';
import { CourseSelector } from './CourseSelector';
import { ModuleSelector } from './ModuleSelector';
import { UnitSelector } from './UnitSelector';
import { CheatsheetViewer } from './CheatsheetViewer';

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
  /** 'up-to-unit' = all cheatsheets from top to selected unit; 'only-this-unit' = just the selected unit */
  const [viewMode, setViewMode] = useState<'up-to-unit' | 'only-this-unit'>('up-to-unit');

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

  // Get cheatsheet content based on view mode
  let combinedContent = '';
  let unitCount = 0;
  if (data && selection.courseName && selection.moduleName && selection.unitName) {
    if (viewMode === 'only-this-unit') {
      combinedContent = getSingleUnitCheatsheet(
        data,
        selection.courseName,
        selection.moduleName,
        selection.unitName
      );
      unitCount = combinedContent ? 1 : 0;
    } else {
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

      {selection.courseName && selection.moduleName && selection.unitName && (
        <div className="view-mode-selector">
          <label>Show cheatsheet:</label>
          <div className="view-mode-options">
            <label className="view-mode-option">
              <input
                type="radio"
                name="viewMode"
                value="up-to-unit"
                checked={viewMode === 'up-to-unit'}
                onChange={() => setViewMode('up-to-unit')}
              />
              <span>All from start up to this unit</span>
            </label>
            <label className="view-mode-option">
              <input
                type="radio"
                name="viewMode"
                value="only-this-unit"
                checked={viewMode === 'only-this-unit'}
                onChange={() => setViewMode('only-this-unit')}
              />
              <span>Only this unit</span>
            </label>
          </div>
        </div>
      )}

      <div className="app-content">
        <CheatsheetViewer
          content={combinedContent}
          unitCount={unitCount}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}


