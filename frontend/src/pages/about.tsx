import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const About: React.FC = () => {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "mn" : "en");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{t("title")}</h1>
      <p style={{ fontSize: "1.3rem", padding: "15px" }}>{t("description")}</p>
      <button onClick={toggleLanguage}>
        {i18n.language === "en" ? "Translate to Mongolian" : "Англи хэл рүү хөрвүүлэх"}
      </button>
    </div>
  );
};

export default About;
