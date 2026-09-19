import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [tunnus, setTunnus] = useState("");
  const [salasana, setSalasana] = useState("");
  const navigate = useNavigate();

  const kirjaudu = () => {
    navigate("/admin");
  };

  return (
    <div className="home">
      <h2>Kirjaudu ylläpitoon</h2>
      <p>Vain henkilökunnalle.</p>

      <div className="admin-form">
        <label htmlFor="tunnus">Käyttäjätunnus</label>
        <input
          id="tunnus"
          type="text"
          value={tunnus}
          onChange={(e) => setTunnus(e.target.value)}
        />

        <label htmlFor="salasana">Salasana</label>
        <input
          id="salasana"
          type="password"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
        />

        <button className="btn" onClick={kirjaudu}>
          Kirjaudu sisään
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;