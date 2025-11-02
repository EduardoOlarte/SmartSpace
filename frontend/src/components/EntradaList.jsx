import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import EntradaModal from "./EntradaModal";
import { useEntradas } from "../hooks/useEntradas";
import parqueaderoService from "../services/parqueaderoService";
import controllerService from "../services/controllerService";

export default function EntradaList({ entradas = [], onSalida }) {
  const { deleteEntrada, registrarSalida, updateEntrada, createEntrada } = useEntradas();
  const [hoverSalidaId, setHoverSalidaId] = useState(null);
  const [hoverDeleteId, setHoverDeleteId] = useState(null);
  const [hoverEditId, setHoverEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);

  const [parqueaderos, setParqueaderos] = useState([]);
  const [controladores, setControladores] = useState([]);

  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const irAEntradas = () => {
        window.location.href = "/entradas";
    };

  // =======================
  // Cargar parqueaderos y controladores
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      const resParq = await parqueaderoService.getAll();
      if (resParq?.success) setParqueaderos(resParq.data || []);

      const resCtrl = await controllerService.getControllers();
      if (resCtrl?.success) setControladores(resCtrl.data || []);
    };
    fetchData();
  }, []);

  // =======================
  // Mapas para lookup rápido
  // =======================
  const parqueaderoMap = useMemo(() => {
    const map = {};
    parqueaderos.forEach((p) => (map[p.id] = p.nombre));
    return map;
  }, [parqueaderos]);

  const controladorMap = useMemo(() => {
    const map = {};
    controladores.forEach((c) => (map[c.id] = c.nombre));
    return map;
  }, [controladores]);

  // =======================
  // Funciones modal
  // =======================
  const handleEdit = (entrada) => {
    setEntradaSeleccionada(entrada);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEntradaSeleccionada(null);
  };

  const handleSubmitModal = async (data, entradaOriginal) => {
    try {
      let result;
      if (entradaOriginal) result = await updateEntrada(entradaOriginal.id, data);
      else result = await createEntrada(data);

      if (result.success) handleCloseModal();
      else console.error("Error al guardar entrada:", result.message);
    } catch (err) {
      console.error("Error al guardar entrada:", err);
    }
  };

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString("es-ES") : "-";

  // =======================
  // Render
  // =======================
  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Avatar</th>
            <th style={thStyle}>Placa</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Parqueadero</th>
            <th style={thStyle}>Controlador</th>
            <th style={thStyle}>Espacio</th>
            <th style={thStyle}>Entrada</th>
            <th style={thStyle}>Salida</th>
            <th style={thStyle}>Activo</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entradas.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: "center", padding: 20 }}>
                No hay entradas registradas aún.
              </td>
            </tr>
          ) : (
            entradas.map((e) => {
              const tipoColor =
                e.tipo_vehiculo === "moto"
                  ? "#f59e0b"
                  : e.tipo_vehiculo === "camion"
                  ? "#dc2626"
                  : "#16a34a";
              const activo = !e.hora_salida;

              return (
                <tr key={e.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>
                    <div style={{ ...avatarStyle, background: tipoColor }}>
                      {e.placa ? e.placa.charAt(0) : "?"}
                    </div>
                  </td>
                  <td style={tdStyle}>{e.placa}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        ...tipoBadgeStyle,
                        background: `${tipoColor}22`,
                        color: tipoColor,
                      }}
                    >
                      {e.tipo_vehiculo}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        ...badgeStyle,
                        background: "#0ea5e9",
                        color: "#fff",
                      }}
                    >
                      {parqueaderoMap[e.parqueadero_id] ?? "Cargando..."}
                    </span>
                  </td>
                  <td style={tdStyle}>{controladorMap[e.controlador_id] ?? "-"}</td>
                  <td style={tdStyle}>{e.espacio_asignado}</td>
                  <td style={tdStyle}>{formatDateTime(e.hora_ingreso)}</td>
                  <td style={tdStyle}>{formatDateTime(e.hora_salida)}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: activo ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {activo && (
                      <button
                        onClick={() =>
                          onSalida ? onSalida(e.id) : registrarSalida(e.id)
                        }
                        onMouseEnter={() => setHoverSalidaId(e.id)}
                        onMouseLeave={() => setHoverSalidaId(null)}
                        style={{
                          ...btnSalidaStyle,
                          transform:
                            hoverSalidaId === e.id ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        Salida
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(e)}
                      onMouseEnter={() => setHoverEditId(e.id)}
                      onMouseLeave={() => setHoverEditId(null)}
                      style={{
                        ...btnEditStyle,
                        transform:
                          hoverEditId === e.id ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <i className="fas fa-edit"></i> Editar
                    </button>

                    {(user?.rol === "administrador" || user?.rol === "operador") && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(`¿Eliminar entrada "${e.placa}"?`)
                          )
                            deleteEntrada(e.id);
                            irAEntradas();
                        }}
                        onMouseEnter={() => setHoverDeleteId(e.id)}
                        onMouseLeave={() => setHoverDeleteId(null)}
                        style={{
                          ...btnDeleteStyle,
                          transform:
                            hoverDeleteId === e.id ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        <i className="fas fa-trash"></i> Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal */}
      <EntradaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        entrada={entradaSeleccionada}
        onSubmit={handleSubmitModal}
        currentUserId={user?.id}
        parqueaderos={parqueaderos}
        controladores={controladores}
      />
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

const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const theadStyle = { background: "#0369a1", color: "white" };
const thStyle = { textAlign: "left", padding: "10px", border: "1px solid #e5e7eb" };
const tdStyle = { padding: "8px", border: "1px solid #e5e7eb" };

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  textTransform: "uppercase",
};

const tipoBadgeStyle = {
  padding: "4px 8px",
  borderRadius: 8,
  fontWeight: 500,
  textTransform: "capitalize",
};

const badgeStyle = {
  padding: "4px 8px",
  borderRadius: 6,
  fontWeight: 500,
};

const btnSalidaStyle = {
  padding: "6px 12px",
  marginRight: 8,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
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
