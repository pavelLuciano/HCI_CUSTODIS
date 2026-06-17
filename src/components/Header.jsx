// src/components/Header.jsx
// Navegación global persistente (esquema de navegación del C3).
import { Link, NavLink } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="contenedor header-inner">
        <Link to="/" className="logo">Custodis</Link>

        <nav className="nav-global" aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/explorar">Explorar</NavLink>
          <NavLink to="/colecciones">Colecciones</NavLink>
        </nav>

        <div className="header-acciones">
          <button className="btn btn-secundario">Iniciar sesión</button>
          <button className="btn btn-primario">Registrarse</button>
        </div>
      </div>
    </header>
  );
}
