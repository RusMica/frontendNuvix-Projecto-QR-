import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";
import NuvixLogo from "./logo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (window.stopScannerGlobal && typeof window.stopScannerGlobal === "function") {
      try {
        await window.stopScannerGlobal();
      } catch (err) {
        console.warn("Scanner ya estaba detenido:", err);
      }
    }

    alert("Sesión cerrada. Redirigiendo a la página de inicio.");
    navigate("/");
  };




  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="navbar-container">
        <motion.div
          className="navbar-brand"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/" className="no-underline">
            <div className="logo-container">
              <img src={NuvixLogo} alt="Nuvix Logo" className="logo-icon-img" />

            </div>
          </Link>
        </motion.div>
        <ul className="navbar-links">
          <li>
            <Link to="/scanner" className="nav-link">
              Escáner
            </Link>
          </li>
          <li>
            <Link to="/events" className="nav-link">
              Eventos
            </Link>
          </li>
          <li>
            <Link to="/records" className="nav-link">
              Registros
            </Link>
          </li>


          <li>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;