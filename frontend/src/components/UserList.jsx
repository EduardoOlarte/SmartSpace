import React, { useState } from "react";

export default function UserList({ users = [], onEdit, onDelete }) {
  const [hoverEditId, setHoverEditId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);

  if (!users.length) return <p>No hay usuarios aún.</p>;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES");
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
            <th style={thStyle}>Avatar</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Creado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const isAdmin = u.rol === "administrador";
            const roleColor = isAdmin ? "#dc2626" : "#2563eb";
            const icon = isAdmin ? "fa-user-shield" : "fa-user-cog";

            return (
              <tr key={u.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
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
                    {u.nombre ? u.nombre.charAt(0) : "?"}
                  </div>
                </td>

                {/* Nombre */}
                <td style={tdStyle}>{u.nombre}</td>

                {/* Email */}
                <td style={tdStyle}>{u.email || "-"}</td>

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
                    {u.rol}
                  </span>
                </td>

                {/* Fecha de creación */}
                <td style={tdStyle}>{formatDate(u.fecha_creacion)}</td>

                {/* Acciones */}
                <td style={tdStyle}>
                  <button
                    onClick={() => onEdit(u)}
                    onMouseEnter={() => setHoverEditId(u.id)}
                    onMouseLeave={() => setHoverEditId(null)}
                    style={{
                      padding: "6px 12px",
                      marginRight: 8,
                      background: "#0369a1",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      transform: hoverEditId === u.id ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar al usuario "${u.nombre}"?`))
                        onDelete(u.id);
                    }}
                    onMouseEnter={() => setHoverDeleteId(u.id)}
                    onMouseLeave={() => setHoverDeleteId(null)}
                    style={{
                      padding: "6px 12px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      transform: hoverDeleteId === u.id ? "scale(1.05)" : "scale(1)",
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
