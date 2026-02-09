/**
 * Page component for adding new cheatsheets.
 */

import { useState, useEffect } from 'react';
import { TextInput } from './TextInput';
import { CheatsheetData } from '../types';
import { loadCheatsheetData } from '../utils/storage';

interface AddCheatsheetsPageProps {
  onNavigateToView: () => void;
  onDataAdded: (data: CheatsheetData) => void;
}

/**
 * AddCheatsheetsPage component for adding new cheatsheets.
 *
 * Args:
 *   onNavigateToView: Callback to navigate to view page.
 *   onDataAdded: Callback when data is added.
 */
export function AddCheatsheetsPage({ onNavigateToView, onDataAdded }: AddCheatsheetsPageProps) {
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    // Load course count from file
    loadCheatsheetData().then((data) => {
      setCourseCount(data?.courses.length || 0);
    });
  }, []);

  const handleDataLoaded = (data: CheatsheetData) => {
    setCourseCount(data.courses.length);
    onDataAdded(data);
  };

  return (
    <div className="add-page">
      <div className="page-header">
        <h2>Add Cheatsheets</h2>
        <div className="page-actions">
          <button onClick={onNavigateToView} className="nav-button">
            View Cheatsheets ({courseCount} courses)
          </button>
        </div>
      </div>
      <TextInput onDataLoaded={handleDataLoaded} />
    </div>
  );
}


