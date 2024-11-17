import React from "react";

interface RadioButtonGroupProps {
  options: { name: string; label: string; content: React.ReactNode }[]; // Each option can have content under it
  selectedOption: string | null;
  onChange: (value: string) => void; // Handle option change
}

const RadioButton: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <div>
      {options.map((option) => (
        <div key={option.name} style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <input
              type="radio"
              name="radio-group"
              checked={selectedOption === option.name}
              onChange={() => onChange(option.name)}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            {option.label}
          </label>
          {/* Render additional content below each option */}
          <div style={{ marginLeft: "30px", marginTop: "10px" }}>
            {selectedOption === option.name && option.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;
