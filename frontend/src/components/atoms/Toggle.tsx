import React, { useState } from 'react';
import { Switch } from '@mui/material';

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleSwitchProps> = ({ initialChecked = false, onChange }) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked); // Call the passed `onChange` function with the new checked value
    }
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      color="primary" // Customize color if needed
    />
  );
};

export default Toggle;
