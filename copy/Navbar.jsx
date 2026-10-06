import { Link, useLocation } from "react-router-dom";

import { useLanguage } from "../frontend/src/i18n";

function Navbar() {
  const { pathname } = useLocation();
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <nav>
      <h1>
        Pizzeria
        <img src="/pizza.svg" alt="" />
      </h1>

      <div className="nav-links">
        {pathname !== "/" && <Link to="/">{t.nav.home}</Link>}
        {pathname !== "/menu" && <Link to="/menu">{t.nav.menu}</Link>}
        {pathname !== "/admin-login" && pathname !== "/admin" && (
          <Link to="/admin-login">{t.nav.admin}</Link>
        )}

        {pathname !== "/cart" && (
          <Link to="/cart" className="cart-link" aria-label={t.nav.cart}>
            <img src="/cart.svg" alt={t.nav.cart} />
          </Link>
        )}

        <div className="language-switcher" aria-label={t.common.selectLanguage}>
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              className={language === code ? "language-button active" : "language-button"}
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
