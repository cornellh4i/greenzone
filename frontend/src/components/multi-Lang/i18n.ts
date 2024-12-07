import i18n from "i18next"; // The core i18n library
import { initReactI18next } from "react-i18next"; // Integrates i18n with React
import i18nBackend from "i18next-http-backend"; // Backend plugin to load translations from a server

// Initialize i18n with the necessary configurations
i18n
  .use(i18nBackend) // Use the backend plugin to load translations from an external source
  .use(initReactI18next) // Integrate i18n with React
  .init({
    fallbackLng: "en", // Fallback language if the selected language is not available
    lng: "en", // Default language to use (English in this case)
    interpolation: {
      escapeValue: false, // Prevents escaping of values (React handles XSS protection automatically)
    },
    backend: {
      // Configuring the path for loading translation files
      loadPath: "http://localhost:8080/languages/{{lng}}-translation.json", // URL pattern to fetch translations
    },
  })
  .then(() => {
    // This logs once i18n has been successfully initialized
    console.log("i18n initialized:", i18n);
  })
  .catch((error) => {
    // If initialization fails, log the error
    console.error("i18n initialization failed:", error);
  });

// Export the i18n instance for use in your app
export default i18n;
