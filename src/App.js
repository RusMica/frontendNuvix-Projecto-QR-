// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Papa from "papaparse";

import Navbar from "./components/Navbar"; 
import Home from "./pages/Home"; 
import Scanner from "./pages/Scanner"; 
import Events from "./pages/Events"; 
import Records from "./pages/Records"; 
import PaymentPage from "./pages/PaymentPage";
import Footer from "./components/Footer";

import "./index.css";
import "./App.css";

function App() {
  const [eventos, setEventos] = useState([]);

  // ... (funciones handleConfirmarRegistro y handleScanAsistente) ...
  const handleConfirmarRegistro = (nuevoEvento, csvFile, onComplete) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const participantes = result.data;
        setEventos(prev => [
          ...prev,
          { nombre: nuevoEvento, participantes, asistentes: [] }
        ]);
        if (onComplete) onComplete(nuevoEvento);
      },
      error: (err) => {
        alert("Error al procesar el archivo CSV.");
        console.error("CSV parse error:", err);
      },
    });
  };

  const handleScanAsistente = (nombreEvento, participante) => {
    setEventos(prev => prev.map(ev => {
      if(ev.nombre === nombreEvento){
        const existe = ev.asistentes.some(p => p.id === participante.id);
        if(!existe){
          return {...ev, asistentes: [...ev.asistentes, participante]};
        }
      }
      return ev;
    }));
  };
  
  return (
    <Router>
      <div className="App-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/scanner" 
            element={<Scanner eventos={eventos} onScan={handleScanAsistente} />} 
          />
          <Route 
            path="/events" 
            element={
              <Events 
                eventos={eventos} 
                onConfirmarRegistro={handleConfirmarRegistro} 
              />
            } 
          />
          <Route 
            path="/records" 
            element={<Records eventos={eventos} />} 
          />
          <Route 
            path="/payment" 
            element={<PaymentPage />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;