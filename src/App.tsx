/**
 * Main application component.
 */

import { useState } from 'react';
import { CheatsheetData } from './types';
import { AddCheatsheetsPage } from './components/AddCheatsheetsPage';
import { ViewCheatsheetsPage } from './components/ViewCheatsheetsPage';

type Page = 'add' | 'view';

/**
 * Main App component that orchestrates the entire application.
 */
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('view');
  const [, setData] = useState<CheatsheetData | null>(null);

  const handleDataUpdated = (updatedData: CheatsheetData) => {
    setData(updatedData);
  };

  const handleNavigateToAdd = () => {
    setCurrentPage('add');
  };

  const handleNavigateToView = () => {
    setCurrentPage('view');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cheatsheet Manager</h1>
        <p className="app-subtitle">Generate Exam Content from Cheatsheets</p>
      </header>

      <main className="app-main">
        {currentPage === 'add' ? (
          <AddCheatsheetsPage
            onNavigateToView={handleNavigateToView}
            onDataAdded={handleDataUpdated}
          />
        ) : (
          <ViewCheatsheetsPage
            onNavigateToAdd={handleNavigateToAdd}
            onDataUpdated={handleDataUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default App;

