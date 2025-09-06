// src/pages/Records.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import "../index.css";

const Records = ({ eventos }) => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleSearch = () => {
    const term = search.toLowerCase();
    const results = eventos.filter(
      (e) =>
        e.nombre.toLowerCase().includes(term) ||
        (e.fecha && e.fecha.includes(term))
    );
    setFiltered(results);
  };

  const downloadCSV = (asistentes, nombre) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      asistentes.map((p) => Object.values(p).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${nombre}_asistentes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="records-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Registros de Asistentes</h1>

      <div className="records-search">
        <input
          type="text"
          placeholder="Buscar por nombre o fecha (YYYY-MM-DD)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {filtered.length === 0 && <p className="no-results">No hay resultados.</p>}

      <ul className="records-list">
        {filtered.map((evento, idx) => (
          <li key={idx} className="record-item">
            <span>{evento.nombre} - {evento.asistentes.length} asistieron</span>
            <button onClick={() => downloadCSV(evento.asistentes, evento.nombre)}>
              Descargar CSV
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Records;
