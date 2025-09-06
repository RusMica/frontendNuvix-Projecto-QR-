import React, { useState } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import * as XLSX from "xlsx";  // 👈 Importamos la librería XLSX
import "../index.css";

const Events = ({ eventos, onConfirmarRegistro }) => {
  const [registrarEventoVisible, setRegistrarEventoVisible] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const [dataFile, setDataFile] = useState(null); // ahora puede ser csv o xlsx
  const [parsedData, setParsedData] = useState(null);
  const [filtroEvento, setFiltroEvento] = useState("");

  // 🔹 Parsear CSV
  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setParsedData(results.data.filter((row) => Object.keys(row).length > 1));
      },
      error: (err) => {
        console.error("Error al leer CSV:", err);
      },
    });
  };

  // 🔹 Parsear XLSX
  const parseXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setParsedData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // 🔹 Detectar tipo de archivo y parsear
  const handleFileChange = (file) => {
    if (!file) return;
    setDataFile(file);

    if (file.name.endsWith(".csv")) {
      parseCSV(file);
    } else if (file.name.endsWith(".xlsx")) {
      parseXLSX(file);
    } else {
      alert("Formato no soportado. Solo se permiten .csv o .xlsx");
      setDataFile(null);
    }
  };

  const handleConfirm = () => {
    if (!nuevoEvento.trim()) {
      alert("Debes ingresar un nombre de evento.");
      return;
    }
    if (!dataFile || !parsedData) {
      alert("Debes cargar un archivo CSV o XLSX de participantes.");
      return;
    }
    onConfirmarRegistro(nuevoEvento, parsedData, (nombre) => {
      setNuevoEvento("");
      setDataFile(null);
      setParsedData(null);
      setRegistrarEventoVisible(false);
      alert(`Evento "${nombre}" registrado con éxito!`);
    });
  };

  const handleDownload = (evento) => {
    const csv = Papa.unparse(evento.participantes);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${evento.nombre}-participantes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nombre.toLowerCase().includes(filtroEvento.toLowerCase())
  );

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <h2>Gestión de Eventos</h2>
        <button
          onClick={() => setRegistrarEventoVisible(!registrarEventoVisible)}
          className="btn"
        >
          {registrarEventoVisible ? "Cancelar" : "Registrar nuevo evento"}
        </button>

        {registrarEventoVisible && (
          <motion.div
            className="registro-evento-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Nombre del evento"
              value={nuevoEvento}
              onChange={(e) => setNuevoEvento(e.target.value)}
              className="input-field"
            />
            <label className="file-input-label">
              Seleccionar archivo CSV o XLSX
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={(e) => handleFileChange(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            {dataFile && <p className="file-name">{dataFile.name}</p>}
            <button onClick={handleConfirm} className="btn">
              Confirmar registro
            </button>
          </motion.div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar evento..."
            value={filtroEvento}
            onChange={(e) => setFiltroEvento(e.target.value)}
            className="input-field"
          />
        </div>

        <h3>Eventos Registrados</h3>
        <ul className="eventos-list">
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((ev, index) => (
              <motion.li
                key={index}
                className="event-item"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <span>
                  {ev.nombre} ({ev.participantes.length} participantes)
                </span>
                <button
                  onClick={() => handleDownload(ev)}
                  className="btn download-btn"
                >
                  Descargar CSV
                </button>
              </motion.li>
            ))
          ) : (
            <p className="no-events-message">No se encontraron eventos.</p>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default Events;
