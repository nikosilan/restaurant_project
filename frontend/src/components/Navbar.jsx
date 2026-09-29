import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav>
      <h1>
        Pizzeria
        <img src="/pizza.svg" alt="" />
      </h1>

      <div className="nav-links">
        {pathname !== "/" && <Link to="/">Home</Link>}
        {pathname !== "/menu" && <Link to="/menu">Menu</Link>}
        {pathname !== "/admin-login" && pathname !== "/admin" && (
          <Link to="/admin-login">Admin</Link>
        )}

        {pathname !== "/cart" && (
          <Link to="/cart" className="cart-link">
            <img src="/cart.svg" alt="Shopping cart" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
