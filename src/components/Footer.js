import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Columna 1 */}
        <div className="footer-section">
          <h3 className="footer-title">Nuvix</h3> 
          <p className="footer-text">
            Control de ingresos y egresos para eventos de forma segura y rápida.
          </p>
        </div>

        {/* Columna 2 */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Navegación</h4>
          <ul className="footer-links">
            {/* Opciones de navegación actualizadas */}
            <li><Link to="/scanner">Escáner</Link></li>
            <li><Link to="/events">Eventos</Link></li>
            <li><Link to="/records">Registros</Link></li>
            <li><Link to="/payment">Comprar Licencia</Link></li> 
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Redes Sociales</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">🌐</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Nuvix. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
