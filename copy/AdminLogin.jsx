import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../frontend/src/i18n";

function AdminLogin() {
  const [tunnus, setTunnus] = useState("");
  const [salasana, setSalasana] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const kirjaudu = () => {
    navigate("/admin");
  };

  return (
    <div className="home">
      <h2>{t.admin.loginTitle}</h2>
      <p>{t.admin.loginSubtitle}</p>

      <div className="admin-form">
        <label htmlFor="tunnus">{t.admin.username}</label>
        <input
          id="tunnus"
          type="text"
          value={tunnus}
          onChange={(e) => setTunnus(e.target.value)}
        />

        <label htmlFor="salasana">{t.admin.password}</label>
        <input
          id="salasana"
          type="password"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
        />

        <button className="btn" onClick={kirjaudu}>
          {t.admin.loginButton}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;