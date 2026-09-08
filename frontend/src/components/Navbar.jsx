import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Pizzeria</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
      </div>
    </nav>
  );
}

export default Navbar;