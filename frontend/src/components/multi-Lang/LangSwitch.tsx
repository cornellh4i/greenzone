import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, FormControlLabel } from "@mui/material";

const LangChange: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const { i18n } = useTranslation();

  // Function to change the language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // Change the language in i18n
    setCurrentLanguage(lang); // Update the current language in state
    localStorage.setItem("language", lang); // Persist the selected language in localStorage
  };

  // Effect to load the language from localStorage when the component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage); // Set the language to the saved value if available
    } else {
      localStorage.setItem("language", currentLanguage); // Initialize language in localStorage if not set
    }
  }, [currentLanguage]);

  // Effect to apply the current language to i18n whenever the language state changes
  useEffect(() => {
    i18n.changeLanguage(currentLanguage); // Change the language in i18n whenever the state changes
  }, [currentLanguage, i18n]);

  return (
    <div>
      {/* Use a toggle switch to switch between English and Spanish */}
      <FormControlLabel
        control={
          <Switch
            checked={currentLanguage === "mong"} // Spanish is true, otherwise English
            onChange={() =>
              changeLanguage(currentLanguage === "en" ? "mong" : "en")
            }
            color="primary"
            name="language-toggle"
            inputProps={{ "aria-label": "language toggle" }}
          />
        }
        label={
          currentLanguage === "en" ? "Switch to Mongolian" : "Switch to English"
        }
      />
    </div>
  );
};

export default LangChange;
