import React from "react";

/**
 * Props for the SidePanelPercentageModal
 */
interface SidePanelPercentageModalProps {
  /** Controls whether the modal is displayed or not */
  isOpen: boolean;
  /** Callback for closing the modal */
  onClose: () => void;
  /** True => Carrying Capacity; False => Z-Score */
  classificationType: boolean;
  /** Numerical values (e.g., percentages) to display in the modal */
  classificationValues: number[];
  /** Labels for each classification category (e.g., "Below Capacity", "At Capacity", "Over Capacity") */
  classificationLabels: string[];
  /** Colors corresponding to each label */
  classificationColourScheme: string[];
}

/**
 * SidePanelPercentageModal:
 * A flexible, tailwind-styled modal that adapts to the length of classificationValues, classificationLabels, etc.
 */
const SidePanelPercentageModal: React.FC<SidePanelPercentageModalProps> = ({
  isOpen,
  onClose,
  classificationType,
  classificationValues,
  classificationLabels,
  classificationColourScheme,
}) => {
  if (!isOpen) return null;

  // Simple logic to decide modal title
  const modalTitle = classificationType ? "Carrying Capacity" : "Z-Score";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {/* Modal Container */}
      <div className="relative w-[90%] max-w-md bg-white rounded-md p-6">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4 text-center">{modalTitle}</h2>

        {/* Dynamic Content */}
        <div className="flex flex-col space-y-2">
          {classificationValues.map((value, idx) => {
            const label = classificationLabels[idx] ?? `Label ${idx + 1}`;
            const color = classificationColourScheme[idx] ?? "#333";

            return (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-gray-200 pb-2"
              >
                {/* Left side: color indicator + label */}
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
                {/* Right side: value */}
                <span className="font-semibold" style={{ color }}>
                  {value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidePanelPercentageModal;
