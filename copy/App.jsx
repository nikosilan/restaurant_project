import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import { LanguageContext, translations } from "./i18n";

function App() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("pizza-language");

    return savedLanguage || "fi";
  });

  useEffect(() => {
    localStorage.setItem("pizza-language", language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: [
          { code: "fi", label: "FI" },
          { code: "en", label: "EN" },
        ],
        t: translations[language],
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </LanguageContext.Provider>
  );
}

export default App;