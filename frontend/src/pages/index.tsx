import { useRouter } from "next/router";
import React, { useState } from "react";
import { Context } from "../utils/global";
import Home from "../components/organisms/Home";

const Landing: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "mn">("en");
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  const contextDict = {
    selectedLanguage,
    setSelectedLanguage,
  };

  return (
    <div>
      <Home />
    </div>
  );
};

export default Landing;
