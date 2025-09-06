import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import "../index.css";

const Scanner = ({ eventos, onScan }) => { // <-- agregamos onScan
  const [scannedResult, setScannedResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const qrCodeRegionRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const scannerActiveRef = useRef(false); // 🔑 flag para saber si el scanner está activo

  // --- Detener el scanner
  const stopScanner = async () => {
    if (!scannerActiveRef.current || !html5QrCodeRef.current) return;

    try {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
      scannerActiveRef.current = false;
      setStarted(false);
      console.log("Scanner detenido correctamente");
    } catch (err) {
      console.log("Error al detener scanner:", err);
    }
  };

  useEffect(() => {
    window.stopScannerGlobal = stopScanner;

    return () => {
      if (scannerActiveRef.current && html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(console.error);
        html5QrCodeRef.current.clear().catch(console.error);
      }
      scannerActiveRef.current = false;
      html5QrCodeRef.current = null;
      delete window.stopScannerGlobal;
    };
  }, []);

  // --- Iniciar escaneo
  const startScanner = () => {
    if (!eventoSeleccionado) {
      alert("Debes seleccionar un evento antes de escanear.");
      return;
    }

    // Si ya había una instancia, detenerla
    stopScanner().finally(() => {
      const config = { fps: 10, qrbox: 250 };
      const html5QrCode = new Html5Qrcode(qrCodeRegionRef.current.id);
      html5QrCodeRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            console.log(`Código detectado: ${decodedText}`);
            setScannedResult(`Evento: ${eventoSeleccionado} | QR: ${decodedText}`);

            // ✅ Parseamos el QR y enviamos al padre
            try {
              const participante = JSON.parse(decodedText); // debe contener id, nombre
              if(onScan) onScan(eventoSeleccionado, participante);
              alert(`${participante.nombre} registrado como asistente.`);
            } catch (err) {
              console.error("Error parseando QR:", err);
              alert("El QR no contiene datos válidos.");
            }

            // Detener automáticamente después de leer
            stopScanner();
          },
          (errorMessage) => {
            console.warn(`Error de escaneo: ${errorMessage}`);
          }
        )
        .then(() => {
          scannerActiveRef.current = true; // ✅ marcar como activo
          setStarted(true);
        })
        .catch((err) => console.error("No se pudo iniciar el escáner", err));
    });
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <h2>Escáner QR</h2>
        <label htmlFor="select-evento" className="label">
          Selecciona un evento:
        </label>
        <select
          id="select-evento"
          value={eventoSeleccionado}
          onChange={(e) => setEventoSeleccionado(e.target.value)}
          className="input-field"
        >
          <option value="">-- Selecciona un evento --</option>
          {eventos.map((ev, index) => (
            <option key={index} value={ev.nombre}>
              {ev.nombre}
            </option>
          ))}
        </select>

        <div ref={qrCodeRegionRef} id="reader" className="qr-scan-window"></div>

        {!started ? (
          <button
            onClick={startScanner}
            className="btn"
            disabled={!eventoSeleccionado}
          >
            Iniciar escaneo
          </button>
        ) : (
          <button onClick={stopScanner} className="btn stop">
            Detener escaneo
          </button>
        )}

        {scannedResult && (
          <motion.p
            className="resultado"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {scannedResult}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Scanner;
