import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParqueaderoList({ parqueaderos = [], onEdit, onDelete }) {
  const [hoverEditId, setHoverEditId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);
  const navigate = useNavigate();

  if (!parqueaderos.length) return <p>No hay parqueaderos aún.</p>;

  const handleGoToHorarios = (nombreParqueadero) => {
    navigate(`/horarios?parqueadero=${encodeURIComponent(nombreParqueadero)}`);
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th style={thStyle}>Avatar</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Ciudad</th>
            <th style={thStyle}>Capacidad</th>
            <th style={thStyle}>Ubicación</th>
            <th style={thStyle}>Horario</th>
            <th style={thStyle}>Días</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parqueaderos.map((p) => {
            const color = getColorByCity(p.ciudad);

            return (
              <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>
                  <div style={{...avatarStyle, background: color}}>
                    {p.nombre ? p.nombre.charAt(0) : "?"}
                  </div>
                </td>
                <td style={tdStyle}>{p.nombre}</td>
                <td style={tdStyle}>{p.ciudad}</td>
                <td style={tdStyle}>{p.capacidad}</td>
                <td style={tdStyle}>{p.ubicacion}</td>

                {/* Botón verde en la columna Horario */}
                <td style={tdStyle}>
                  <button
                    onClick={() => handleGoToHorarios(p.nombre)}
                    style={btnHorarioStyle}
                  >
                    Ver Horarios
                  </button>
                </td>

                <td style={tdStyle}>
                  <span style={diasStyle}>
                    {p.dias_operacion?.replace(/-/g, ", ")}
                  </span>
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => onEdit(p)}
                    onMouseEnter={() => setHoverEditId(p.id)}
                    onMouseLeave={() => setHoverEditId(null)}
                    style={{ ...btnActionStyle, transform: hoverEditId === p.id ? "scale(1.05)" : "scale(1)" }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => { if (window.confirm(`¿Eliminar el parqueadero "${p.nombre}"?`)) onDelete(p.id); }}
                    onMouseEnter={() => setHoverDeleteId(p.id)}
                    onMouseLeave={() => setHoverDeleteId(null)}
                    style={{ ...btnDeleteStyle, transform: hoverDeleteId === p.id ? "scale(1.05)" : "scale(1)" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ===== Estilos =====
const containerStyle = {
  overflowX: "auto",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  marginTop: 16,
  boxSizing: "border-box",
  background: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  borderRadius: 10,
  overflow: "hidden",
};

const theadStyle = { background: "#0369a1", color: "white" };
const thStyle = { textAlign: "left", padding: "10px", border: "1px solid #e5e7eb" };
const tdStyle = { padding: "8px", border: "1px solid #e5e7eb" };
const avatarStyle = { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: "bold", textTransform: "uppercase" };
const btnHorarioStyle = { padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnActionStyle = { padding: "6px 12px", marginRight: 8, background: "#0369a1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", transition: "all 0.2s ease-in-out" };
const btnDeleteStyle = { padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", transition: "all 0.2s ease-in-out" };
const diasStyle = { background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: 8, fontWeight: 500 };

function getColorByCity(ciudad = "") {
  const colors = { Bogotá: "#2563eb", Tunja: "#10b981", Medellín: "#f59e0b", Cali: "#8b5cf6", default: "#64748b" };
  return colors[ciudad] || colors.default;
}
