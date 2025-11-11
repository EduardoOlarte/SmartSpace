import React, { useState } from "react";

export default function TarifaList({ tarifas = [], onEdit, onDelete }) {
  const [hoverEditId, setHoverEditId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);

  if (!tarifas.length) return <p>No hay tarifas aún.</p>;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTipoCalculoColor = (tipo) => {
    const colors = {
      'por_hora': '#3b82f6',
      'por_dia': '#10b981',
      'por_minuto': '#f59e0b',
      'fijo': '#8b5cf6'
    };
    return colors[tipo] || '#64748b';
  };

  const getTipoVehiculoIcon = (tipo) => {
    const icons = {
      'automovil': 'fa-car',
      'moto': 'fa-motorcycle',
      'camion': 'fa-truck',
      'todos': 'fa-car-side'
    };
    return icons[tipo] || 'fa-car';
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Tipo Cálculo</th>
            <th style={thStyle}>Tipo Vehículo</th>
            <th style={thStyle}>Parqueadero</th>
            <th style={thStyle}>Día</th>
            <th style={thStyle}>Horario</th>
            <th style={thStyle}>Precio</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tarifas.map((t) => {
            const tipoColor = getTipoCalculoColor(t.tipo_calculo);
            const vehiculoIcon = getTipoVehiculoIcon(t.tipo_vehiculo);

            return (
              <tr key={t.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                {/* Nombre */}
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: tipoColor
                      }}
                    />
                    <strong>{t.nombre}</strong>
                  </div>
                  {t.descripcion && (
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      {t.descripcion}
                    </div>
                  )}
                </td>

                {/* Tipo Cálculo */}
                <td style={tdStyle}>
                  <span
                    style={{
                      background: `${tipoColor}22`,
                      color: tipoColor,
                      padding: "4px 8px",
                      borderRadius: 8,
                      fontWeight: 500,
                      textTransform: "capitalize",
                      fontSize: "13px"
                    }}
                  >
                    {t.tipo_calculo.replace('_', ' ')}
                  </span>
                </td>

                {/* Tipo Vehículo */}
                <td style={tdStyle}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <i className={`fas ${vehiculoIcon}`} style={{ color: "#64748b" }}></i>
                    <span style={{ textTransform: "capitalize" }}>{t.tipo_vehiculo || "Todos"}</span>
                  </span>
                </td>

                {/* Parqueadero */}
                <td style={tdStyle}>
                  {t.parqueadero_nombre ? (
                    <span style={{ ...badgeStyle, background: "#dbeafe", color: "#1e40af" }}>
                      {t.parqueadero_nombre}
                    </span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>Todos</span>
                  )}
                </td>

                {/* Día */}
                <td style={tdStyle}>
                  {t.dia_semana && t.dia_semana !== "Todos" ? (
                    <span style={{ ...badgeStyle, background: "#fef3c7", color: "#92400e" }}>
                      {t.dia_semana}
                    </span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>Todos</span>
                  )}
                </td>

                {/* Horario */}
                <td style={tdStyle}>
                  {t.hora_inicio && t.hora_fin ? (
                    <span style={{ fontSize: "13px", color: "#4b5563" }}>
                      {t.hora_inicio.slice(0, 5)} - {t.hora_fin.slice(0, 5)}
                    </span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>Todo el día</span>
                  )}
                </td>

                {/* Precio */}
                <td style={tdStyle}>
                  <strong style={{ color: "#059669", fontSize: "15px" }}>
                    {formatPrice(t.precio)}
                  </strong>
                </td>

                {/* Estado */}
                <td style={tdStyle}>
                  <span
                    style={{
                      color: t.activo ? "#16a34a" : "#dc2626",
                      fontWeight: "bold",
                      fontSize: "13px"
                    }}
                  >
                    {t.activo ? "Activa" : "Inactiva"}
                  </span>
                </td>

                {/* Acciones */}
                <td style={tdStyle}>
                  <button
                    onClick={() => onEdit(t)}
                    onMouseEnter={() => setHoverEditId(t.id)}
                    onMouseLeave={() => setHoverEditId(null)}
                    style={{
                      ...btnEditStyle,
                      transform: hoverEditId === t.id ? "scale(1.05)" : "scale(1)"
                    }}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la tarifa "${t.nombre}"?`))
                        onDelete(t.id);
                    }}
                    onMouseEnter={() => setHoverDeleteId(t.id)}
                    onMouseLeave={() => setHoverDeleteId(null)}
                    style={{
                      ...btnDeleteStyle,
                      transform: hoverDeleteId === t.id ? "scale(1.05)" : "scale(1)"
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

// ===== Estilos =====
const containerStyle = {
  overflowX: "auto",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  marginTop: 16,
  background: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

const theadStyle = {
  background: "#0369a1",
  color: "white",
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #e5e7eb",
};

const badgeStyle = {
  padding: "4px 8px",
  borderRadius: 6,
  fontWeight: 500,
  fontSize: "12px",
  display: "inline-block"
};

const btnEditStyle = {
  padding: "6px 12px",
  marginRight: 8,
  background: "#0369a1",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
};

const btnDeleteStyle = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
};