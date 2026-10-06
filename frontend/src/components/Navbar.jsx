import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";

function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, languages, t } = useLanguage();

  const logOut = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      <Link to="/" className="logo-link">
        <h1>
          Pizzeria
          <img src="/pizza.svg" alt="" />
        </h1>
      </Link>

      <div className="nav-links">
        {pathname !== "/" && <Link to="/">{t.nav.home}</Link>}

        {pathname !== "/menu" && <Link to="/menu">{t.nav.menu}</Link>}

        {!user && pathname !== "/login" && (
          <Link to="/login">log in</Link>
        )}

        {!user && pathname !== "/register" && (
          <Link to="/register">register</Link>
        )}

        {!user &&
          pathname !== "/admin-login" &&
          pathname !== "/admin" && (
            <Link to="/admin-login">{t.nav.admin}</Link>
          )}

        {user?.role === "admin" && pathname !== "/admin" && (
          <Link to="/admin">{t.nav.admin}</Link>
        )}

        {user && (
          <button className="nav-btn" onClick={logOut}>
            log out
          </button>
        )}

        {pathname !== "/cart" && (
          <Link
            to="/cart"
            className="cart-link"
            aria-label={t.nav.cart}
          >
            <img src="/cart.svg" alt={t.nav.cart} />
          </Link>
        )}

        <div
          className="language-switcher"
          aria-label={t.common.selectLanguage}
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              className={
                language === code
                  ? "language-button active"
                  : "language-button"
              }
              onClick={() => setLanguage(code)}
              aria-pressed={language === code}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;