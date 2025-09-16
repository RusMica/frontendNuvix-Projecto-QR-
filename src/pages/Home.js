import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles'; // Importamos Particles
import { loadSlim } from 'tsparticles-slim'; // Para una carga más ligera de partículas
import '../index.css'; // Asegúrate de que los estilos globales estén importados

const Home = () => {
  // Configuración de las partículas
  const particlesInit = async (main) => {
    await loadSlim(main);
  };

  const particlesLoaded = (container) => {
    console.log("Particles container loaded", container);
  };

const particlesOptions = {
  background: {
    color: {
      value: "#0A0F1E", // fondo profundo para contraste
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: {
      value: ["#F2E96B", "#00F5D4"],  
      // Amarillo pastel (resalta) + Cian neón (acompaña)
    },
    links: {
      color: "#7B2FF7", // líneas violetas
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1,
    },
    collisions: { enable: true },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      speed: 1.2,
    },
    number: {
      density: { enable: true, area: 800 },
      value: 80,
    },
    opacity: { value: 0.6 },
    shape: { type: "circle" },
    size: { value: { min: 2, max: 6 } }, // un poco más grandes para que brillen
  },
  detectRetina: true,
};



  return (
    <div className="home-wrapper">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.h1
          className="home-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Bienvenido a NuviX
        </motion.h1>
        <motion.p
          className="home-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Donde la seguridad se vuelve simple.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link to="/scanner" className="btn home-btn">
            Iniciar Sesion
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;