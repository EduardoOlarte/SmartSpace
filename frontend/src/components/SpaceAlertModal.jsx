import React, { useEffect } from "react";
import "../styles/SpaceAlertModal.css";

export default function SpaceAlertModal({ parqueadero, espaciosDisponibles, onClose }) {
  useEffect(() => {
    // Reproducir sonido de alerta usando un sonido simple
    playAlertSound();
  }, []);

  const playAlertSound = () => {
    try {
      // Crear múltiples tonos para un sonido de alerta más noticeable
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Primer beep
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.frequency.value = 800;
      osc1.type = "sine";
      gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.3);

      // Segundo beep más alto
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1200;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.4);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
      osc2.start(audioContext.currentTime + 0.4);
      osc2.stop(audioContext.currentTime + 0.7);

      // Tercer beep
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc3.frequency.value = 1000;
      osc3.type = "sine";
      gain3.gain.setValueAtTime(0.3, audioContext.currentTime + 0.8);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.1);
      osc3.start(audioContext.currentTime + 0.8);
      osc3.stop(audioContext.currentTime + 1.1);
    } catch (err) {
      console.error("Error reproduciendo sonido:", err);
    }
  };

  const capacidadUtilizada = parqueadero.capacidad - espaciosDisponibles;
  const porcentajeUtilizado = Math.round((capacidadUtilizada / parqueadero.capacidad) * 100);

  return (
    <div className="space-alert-overlay">
      <div className="space-alert-modal">
        <div className="alert-header">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>⚠️ ALERTA DE ESPACIOS BAJOS</h2>
        </div>

        <div className="alert-body">
          <div className="parqueadero-info">
            <h3>{parqueadero.nombre}</h3>
            <p className="ubicacion">{parqueadero.ubicacion}</p>
          </div>

          <div className="space-info">
            <div className="space-stat">
              <span className="label">Espacios Disponibles:</span>
              <span className="value critical">{espaciosDisponibles}/{parqueadero.capacidad}</span>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill critical" 
                style={{ width: `${porcentajeUtilizado}%` }}
              >
                {porcentajeUtilizado}%
              </div>
            </div>

            <div className="space-details">
              <div>
                <strong>Capacidad Total:</strong> {parqueadero.capacidad}
              </div>
              <div>
                <strong>Espacios Ocupados:</strong> {capacidadUtilizada}
              </div>
              <div>
                <strong>Espacios Libres:</strong> <span className="critical">{espaciosDisponibles}</span>
              </div>
            </div>
          </div>

          <div className="alert-message">
            <p>
              El parqueadero <strong>{parqueadero.nombre}</strong> está alcanzando su capacidad máxima.
              Solo quedan <strong>{espaciosDisponibles} espacios disponibles</strong>.
            </p>
            <p>Se recomienda:</p>
            <ul>
              <li>Informar a operadores sobre disponibilidad limitada</li>
              <li>Derivar nuevos vehículos a otros parqueaderos</li>
              <li>Acelerar cobros y salidas</li>
            </ul>
          </div>
        </div>

        <div className="alert-footer">
          <button className="btn btn-primary" onClick={onClose}>
            <i className="fas fa-check"></i> Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
