import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// static import of your JSON
import mapprovince_en from "../public/en/mapprovince.json";
import sidepanel_en from "../public/en/sidepanel.json";
import mapprovince_mn from "../public/mn/mapprovince.json";
import sidepanel_mn from "../public/mn/sidepanel.json";
import landing_en from "../public/en/landing.json";
import landing_mn from "../public/mn/landing.json";
import navbar_en from "../public/en/navbar.json";
import navbar_mn from "../public/mn/navbar.json";
import about_en from "../public/en/about.json";
import about_mn from "../public/mn/about.json";
import footer_en from "../public/en/footer.json";
import footer_mn from "../public/mn/footer.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      mapprovince: mapprovince_en,
      sidepanel: sidepanel_en,
      landing: landing_en,
      navbar: navbar_en,
      about: about_en,
      footer: footer_en,
    },
    mn: {
      mapprovince: mapprovince_mn,
      sidepanel: sidepanel_mn,
      landing: landing_mn,
      navbar: navbar_mn,
      about: about_mn,
      footer: footer_mn,
    },
  },
  fallbackLng: "en",

  ns: ["mapprovince", "sidepanel", "landing", "navbar", "about", "footer"],
  defaultNS: "mapprovince",

  interpolation: { escapeValue: false },
});

export default i18n;
