import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav>
      <h1>Pizzeria</h1>

      <div className="nav-links">
        {pathname !== "/" && <Link to="/">Home</Link>}
        {pathname !== "/menu" && <Link to="/menu">Menu</Link>}
      </div>
    </nav>
  );
}

export default Navbar;
