import React, { useState } from "react";

export default function HorariosList({ horarios = [], onEdit, onDelete }) {
  const [hoverEditId, setHoverEditId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);

  if (!horarios.length) return <p>No hay horarios aún.</p>;

  const formatHour = (hourString) => {
    if (!hourString) return "-";
    return hourString.slice(0, 5); // muestra HH:mm si viene en formato completo
  };

  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #d1d5db",
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        marginTop: 10,
        background: "#fff",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#0369a1", color: "white" }}>
            <th style={thStyle}>Día</th>
            <th style={thStyle}>Hora Inicio</th>
            <th style={thStyle}>Hora Fin</th>
            <th style={thStyle}>Asignado a</th>
            <th style={thStyle}>Activo</th> {/* 🔹 Nueva columna */}
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {horarios.map((h) => (
            <tr key={h.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              {/* Día */}
              <td style={tdStyle}>
                <span
                  style={{
                    background: "#0369a122",
                    color: "#0369a1",
                    padding: "4px 8px",
                    borderRadius: 8,
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  <i className="fas fa-calendar-day" style={{ marginRight: 6 }}></i>
                  {h.dia_semana || h.dia}
                </span>
              </td>

              {/* Hora inicio */}
              <td style={tdStyle}>{formatHour(h.hora_apertura || h.hora_inicio)}</td>

              {/* Hora fin */}
              <td style={tdStyle}>{formatHour(h.hora_cierre || h.hora_fin)}</td>

              {/* Asignado a (nombre del parqueadero) */}
              <td style={tdStyle}>{h.asignadoa || h.asignadoA || h.parqueadero_nombre || "-"}</td>

              {/* Activo */}
              <td style={tdStyle}>
                <span
                  style={{
                    color: h.activo ? "#16a34a" : "#dc2626",
                    fontWeight: "bold",
                  }}
                >
                  {h.activo ? "Sí" : "No"}
                </span>
              </td>

              {/* Acciones */}
              <td style={{ ...tdStyle, width: "180px", whiteSpace: "nowrap" }}>
                <button
                  onClick={() => onEdit(h)}
                  onMouseEnter={() => setHoverEditId(h.id)}
                  onMouseLeave={() => setHoverEditId(null)}
                  style={{
                    padding: "6px 12px",
                    marginRight: 8,
                    background: "#0369a1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    transform: hoverEditId === h.id ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <i className="fas fa-edit"></i> Editar
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar el horario del día "${h.dia_semana || h.dia}"?`))
                      onDelete(h.id);
                  }}
                  onMouseEnter={() => setHoverDeleteId(h.id)}
                  onMouseLeave={() => setHoverDeleteId(null)}
                  style={{
                    padding: "6px 12px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    transform: hoverDeleteId === h.id ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// estilos reutilizables
const thStyle = {
  textAlign: "left",
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #e5e7eb",
};
