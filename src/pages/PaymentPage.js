import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import "../index.css";


function PaymentPage() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);

  useEffect(() => {
    initMercadoPago("TEST-XXXXXXXXXXXXXXXXXXXX", { locale: "es-AR" });
  }, []);

  const createPreference = (title, price) => {
    setPreferenceId(null); // Reinicia la preferencia para mostrar el mensaje de carga
    setSelectedLicense({ title, price }); // Guarda la licencia seleccionada

    fetch("http://localhost:4000/api/create_preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price }),
    })
      .then((res) => res.json())
      .then((data) => setPreferenceId(data.id))
      .catch((err) => console.error("Error creando preferencia:", err));
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Adquirir Licencia</h1>
        <p className="payment-description">
          Con tu licencia activa podrás gestionar el sistema de control de
          ingresos y egresos de tus eventos sin limitaciones.
        </p>

        <div className="license-options">
          {/* Opción de Licencia Mensual */}
          <div className="license-option" onClick={() => createPreference("Licencia Mensual", 1000)}>
            <h2>Licencia Mensual</h2>
            <p>$1000 ARS</p>
          </div>
          
          {/* Opción de Licencia por Evento */}
          <div className="license-option" onClick={() => createPreference("Licencia por Evento", 500)}>
            <h2>Licencia por Evento</h2>
            <p>$500 ARS</p>
          </div>
        </div>

        <div className="wallet-container">
          {preferenceId ? (
            <Wallet initialization={{ preferenceId }} />
          ) : selectedLicense ? (
            <p className="loading-text">Cargando opciones de pago para {selectedLicense.title}...</p>
          ) : (
            <p className="loading-text">Selecciona una licencia para continuar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;