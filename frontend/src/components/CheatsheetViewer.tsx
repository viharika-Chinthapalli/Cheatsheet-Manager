/**
 * Component for displaying the combined cheatsheet content.
 */

interface CheatsheetViewerProps {
  content: string;
  unitCount: number;
  /** When 'only-this-unit', header shows single-unit label. */
  viewMode?: 'up-to-unit' | 'only-this-unit';
}

/**
 * CheatsheetViewer component displays the combined cheatsheet content.
 *
 * Args:
 *   content: The combined cheatsheet content to display.
 *   unitCount: Number of units included in the content.
 */
export function CheatsheetViewer({ content, unitCount, viewMode }: CheatsheetViewerProps) {
  if (!content) {
    return (
      <div className="cheatsheet-viewer empty">
        <p>Select a course, module, and unit to view cheatsheets.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Cheatsheet content copied to clipboard!');
    });
  };

  const headerTitle =
    viewMode === 'only-this-unit' ? 'This Unit\'s Cheatsheet' : 'Combined Cheatsheet Content';

  return (
    <div className="cheatsheet-viewer">
      <div className="cheatsheet-viewer-header">
        <h3>{headerTitle}</h3>
        <div className="cheatsheet-viewer-meta">
          <span className="unit-count">{unitCount} unit(s) included</span>
          <button onClick={handleCopy} className="copy-button">
            Copy to Clipboard
          </button>
        </div>
      </div>
      <div className="cheatsheet-viewer-content">
        <pre>{content}</pre>
      </div>
    </div>
  );
}


