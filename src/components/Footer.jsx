// src/components/Footer.jsx
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-inner">
        <p className="footer-texto">
          @2026 Custodis. Todos los derechos reservados.<br />
          Universidad Austral de Chile. Facultad Ciencias de la Ingeniería
        </p>
        <span className="footer-logo">Custodis</span>
      </div>
    </footer>
  );
}
