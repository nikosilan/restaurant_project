import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        {pathname !== "/" && <Link to="/">Home</Link>}

        {!user && pathname !== "/login" && <Link to="/login">log in</Link>}
        {!user && pathname !== "/register" && (
          <Link to="/register">register</Link>
        )}
        {!user && pathname !== "/admin-login" && pathname !== "/admin" && (
          <Link to="/admin-login">Admin</Link>
        )}

        {user?.role === "admin" && pathname !== "/admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {user && (
          <button className="nav-btn" onClick={logOut}>
            log out
          </button>
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
