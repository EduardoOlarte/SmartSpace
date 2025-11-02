import React, { useState } from "react";

export default function ControllerList({ controllers = [], onEdit, onDelete }) {
  const [hoverEditId, setHoverEditId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);

  if (!controllers.length) return <p>No hay controladores aún.</p>;

  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #d1d5db",
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        background: "#fff",
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0, // 🔹 sin margen lateral ni inferior
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
            <th style={thStyle}>Avatar</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Identificación</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Activo</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {controllers.map((c) => {
            const isSupervisor = c.rol === "supervisor";
            const roleColor = isSupervisor ? "#10b981" : "#2563eb";
            const icon = isSupervisor ? "fa-user-tie" : "fa-user-cog";

            return (
              <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                {/* Avatar */}
                <td style={tdStyle}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: roleColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.nombre ? c.nombre.charAt(0) : "?"}
                  </div>
                </td>

                {/* Nombre */}
                <td style={tdStyle}>{c.nombre}</td>

                {/* Identificación */}
                <td style={tdStyle}>{c.identificacion}</td>

                {/* Teléfono */}
                <td style={tdStyle}>{c.telefono || "-"}</td>

                {/* Rol */}
                <td style={tdStyle}>
                  <span
                    style={{
                      background: `${roleColor}22`,
                      color: roleColor,
                      padding: "4px 8px",
                      borderRadius: 8,
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  >
                    <i className={`fas ${icon}`} style={{ marginRight: 6 }}></i>
                    {c.rol}
                  </span>
                </td>

                {/* Activo */}
                <td style={tdStyle}>
                  <span
                    style={{
                      color: c.activo ? "#16a34a" : "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    {c.activo ? "Sí" : "No"}
                  </span>
                </td>

                {/* Acciones */}
                <td style={tdStyle}>
                  <button
                    onClick={() => onEdit(c)}
                    onMouseEnter={() => setHoverEditId(c.id)}
                    onMouseLeave={() => setHoverEditId(null)}
                    style={{
                      padding: "6px 12px",
                      marginRight: 8,
                      background: "#0369a1",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      transform:
                        hoverEditId === c.id ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(`¿Eliminar al controlador "${c.nombre}"?`)
                      )
                        onDelete(c.id);
                    }}
                    onMouseEnter={() => setHoverDeleteId(c.id)}
                    onMouseLeave={() => setHoverDeleteId(null)}
                    style={{
                      padding: "6px 12px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      transform:
                        hoverDeleteId === c.id ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <i className="fas fa-trash"></i> Eliminar
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
