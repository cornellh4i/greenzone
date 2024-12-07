import React from "react";
import NavBar from "../components/molecules/NavBar";

import { useTranslation } from "react-i18next";
import "../components/multi-Lang/i18n"; // This will trigger i18n initialization
import LangChange from "../components/multi-Lang/LangSwitch";

const Methodology = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center p-4">
      <LangChange />
      <NavBar />
      <h1 className="text-2xl font-semibold">{t("methodology")}</h1>
    </div>
  );
};

export default Methodology;
