import React from "react";
import { useTranslation } from "react-i18next";
import "../components/multi-Lang/i18n"; // This will trigger i18n initialization
import LangChange from "../components/multi-Lang/LangSwitch";

const Lang = () => {
  const { t } = useTranslation();

  return (
    <main className="lang-container">
      <LangChange />
      <section className="content-section">
        <h1 className="title">{t("home")}</h1>
        <h2 className="subtitle">{t("about")}</h2>
        <h3 className="title">{t("title")}</h3>
        <p className="label">{t("label")}</p>
        <p className="text">{t("text")}</p>
      </section>
    </main>
  );
};

export default Lang;
