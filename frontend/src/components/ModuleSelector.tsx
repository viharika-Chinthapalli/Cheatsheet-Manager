/**
 * Component for selecting a module within a course.
 */

import { Module } from '../types';

interface ModuleSelectorProps {
  modules: Module[];
  selectedModuleName: string | null;
  onModuleChange: (moduleName: string) => void;
  disabled: boolean;
}

/**
 * ModuleSelector component displays a dropdown to select a module.
 *
 * Args:
 *   modules: Array of available modules.
 *   selectedModuleName: Currently selected module name.
 *   onModuleChange: Callback when module selection changes.
 *   disabled: Whether the selector should be disabled.
 */
export function ModuleSelector({
  modules,
  selectedModuleName,
  onModuleChange,
  disabled,
}: ModuleSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModuleChange(e.target.value);
  };

  return (
    <div className="selector">
      <label htmlFor="module-select" className="selector-label">
        Select Module:
      </label>
      <select
        id="module-select"
        value={selectedModuleName || ''}
        onChange={handleChange}
        disabled={disabled}
        className="selector-select"
      >
        <option value="">-- Choose a module --</option>
        {modules.map((module) => (
          <option key={module.name} value={module.name}>
            {module.name}
          </option>
        ))}
      </select>
    </div>
  );
}


