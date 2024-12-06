import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      <Link className="navbar-link" to="/">
        Inicio
      </Link>
      <Link className="navbar-link" to="/reservas">
        Reservas
      </Link>
      <Link className="navbar-link" to="/reservas/nueva">
        Nueva Reserva
      </Link>
    </div>
  </nav>
);

export default Navbar;
