import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const kirjaudu = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.user.role !== "admin") {
      logout();
      setError("This account does not have administrator access.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="home auth-page">
      <h2>Kirjaudu ylläpitoon</h2>
      <p>Vain henkilökunnalle.</p>

      <form className="admin-form" onSubmit={kirjaudu}>
        <label htmlFor="email">Sähköposti</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="salasana">Salasana</label>
        <input
          id="salasana"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p role="alert">{error}</p>}

        <button className="btn" type="submit">
          Kirjaudu sisään
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
