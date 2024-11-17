import React, { useState, ReactNode } from 'react';

interface Checkbox {
  name: string;
  label: string;
}

interface CheckboxGroupProps {
  checkboxes: Checkbox[];
  rowCount: number;
  onChange: (name: string, checked: boolean) => void;
  children?: ReactNode; // Accept children as an optional prop
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ checkboxes, rowCount, onChange, children }) => {
  const [checkedStates, setCheckedStates] = useState(
    checkboxes.reduce((acc, checkbox) => {
      acc[checkbox.name] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleCheckboxChange = (name: string) => {
    setCheckedStates((prev) => {
      const newCheckedState = !prev[name];
      onChange(name, newCheckedState); // Trigger the external onChange function
      return {
        ...prev,
        [name]: newCheckedState,
      };
    });
  };

  return (
    <div>
      {children && <div style={{ marginBottom: '10px' }}>{children}</div>} {/* Render children above checkboxes */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${rowCount}, 1fr)`,
          gap: '10px',
        }}
      >
        {checkboxes.map((checkbox) => (
          <label key={checkbox.name} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={checkedStates[checkbox.name]}
              onChange={() => handleCheckboxChange(checkbox.name)}
            />
            {checkbox.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
