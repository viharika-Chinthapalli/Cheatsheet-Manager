/**
 * Component for selecting a unit within a module.
 */

import { Unit } from '../types';

interface UnitSelectorProps {
  units: Unit[];
  selectedUnitName: string | null;
  onUnitChange: (unitName: string) => void;
  disabled: boolean;
}

/**
 * UnitSelector component displays a dropdown to select a unit.
 *
 * Args:
 *   units: Array of available units.
 *   selectedUnitName: Currently selected unit name.
 *   onUnitChange: Callback when unit selection changes.
 *   disabled: Whether the selector should be disabled.
 */
export function UnitSelector({
  units,
  selectedUnitName,
  onUnitChange,
  disabled,
}: UnitSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUnitChange(e.target.value);
  };

  return (
    <div className="selector">
      <label htmlFor="unit-select" className="selector-label">
        Select Unit:
      </label>
      <select
        id="unit-select"
        value={selectedUnitName || ''}
        onChange={handleChange}
        disabled={disabled}
        className="selector-select"
      >
        <option value="">-- Choose a unit --</option>
        {units.map((unit) => (
          <option key={unit.name} value={unit.name}>
            {unit.name}
          </option>
        ))}
      </select>
    </div>
  );
}

