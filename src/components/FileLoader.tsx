/**
 * Component for loading the cheatsheet JSON file from local storage.
 */

import { ChangeEvent } from 'react';
import { CheatsheetData } from '../types';

interface FileLoaderProps {
  onDataLoaded: (data: CheatsheetData) => void;
}

/**
 * FileLoader component allows users to load a local JSON file.
 *
 * Args:
 *   onDataLoaded: Callback function called when data is successfully loaded.
 */
export function FileLoader({ onDataLoaded }: FileLoaderProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: CheatsheetData = JSON.parse(content);
        onDataLoaded(data);
      } catch (error) {
        alert('Error parsing JSON file. Please ensure the file is valid JSON.');
        console.error('JSON parse error:', error);
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-loader">
      <label htmlFor="json-file-input" className="file-loader-label">
        Load Cheatsheet Data (JSON)
      </label>
      <input
        id="json-file-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="file-loader-input"
      />
      <p className="file-loader-hint">
        Select your cheatsheets.json file to begin
      </p>
    </div>
  );
}




