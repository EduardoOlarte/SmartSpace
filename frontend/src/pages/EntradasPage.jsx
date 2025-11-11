import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEntradas } from "../hooks/useEntradas";
import EntradaList from "../components/EntradaList";
import EntradaModal from "../components/EntradaModal";
import { NavLink } from "react-router-dom";

export default function EntradasPage() {
  const {
    entradas,
    loading,
    error,
    loadEntradas,
    createEntrada,
    updateEntrada,
    registrarSalida,
    searchEntradas,
  } = useEntradas();

  const [showModal, setShowModal] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [displayEntradas, setDisplayEntradas] = useState([]);

  const [searchParams] = useSearchParams();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  // ==============================
  // Crear / Editar
  // ==============================
  const handleCreateEntrada = () => {
    setEditingEntrada(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const result = editingEntrada
        ? await updateEntrada(editingEntrada.id, formData)
        : await createEntrada(formData);

      if (result.message) {
        showAlert(result.success ? "success" : "error", result.message);
        loadEntradas();
      }

      if (result.success) {
        const allEntradas = await loadEntradas();
        setDisplayEntradas(allEntradas);
        setShowModal(false);
        setEditingEntrada(null);
      }
      
    } catch (err) {
      showAlert("error", err.response?.data?.message || err.message || "Error desconocido");
    }
  };

  // ==============================
  // Registrar salida
  // ==============================
  const handleRegistrarSalida = async (id) => {
    if (!window.confirm("Registrar salida de este vehículo?")) return;
    try {
      const res = await registrarSalida(id);
      showAlert(res.success ? "success" : "error", res.message);
      if (res.success) {
        const allEntradas = await loadEntradas();
        setDisplayEntradas(allEntradas);
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // ==============================
  // Búsqueda
  // ==============================
 // Dentro de EntradasPage

const handleSearch = async (value = searchValue) => {
  try {
    if (!value.trim()) {
      // Si no hay término, recarga todo
      const allEntradas = await loadEntradas();
      setDisplayEntradas(allEntradas);
      return;
    }

    let filtered = [];

    // 🔹 Búsqueda local según criterio
    switch (searchCriteria) {
      case "placa":
        filtered = entradas.filter((e) =>
          (e.placa || "").toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "tipo_vehiculo":
        filtered = entradas.filter((e) =>
          (e.tipo_vehiculo || "").toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "estado":
        filtered = entradas.filter((e) =>
          (e.estado || "").toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "nombre":
        filtered = entradas.filter(
          (e) =>
            (e.parqueadero_nombre || "").toLowerCase().includes(value.toLowerCase()) ||
            (e.vehiculo_nombre || "").toLowerCase().includes(value.toLowerCase())
        );
        break;
      default:
        // Si no hay criterio válido, carga todo del backend
        const allEntradas = await loadEntradas();
        filtered = allEntradas;
        break;
    }

    setDisplayEntradas(filtered);
    showAlert("success", `Se encontraron ${filtered.length} entradas`);

  } catch (err) {
    showAlert("error", err.message);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ==============================
  // Estadísticas
  // ==============================
  const vehiculosPorTipo = displayEntradas.reduce(
    (acc, e) => {
      if (e.tipo_vehiculo === "automovil") acc.automovil += 1;
      else if (e.tipo_vehiculo === "moto") acc.moto += 1;
      else if (e.tipo_vehiculo === "camion") acc.camion += 1;
      else acc.otros += 1;
      return acc;
    },
    { automovil: 0, moto: 0, camion: 0, otros: 0 }
  );

  // ==============================
  // Cargar entradas al montar y filtrar por URL
  // ==============================
  useEffect(() => {
    const refreshEntradas = async () => {
      const parqueadero = searchParams.get("parqueadero");

      const allEntradas = await loadEntradas();

      if (parqueadero) {
        setSearchCriteria("parqueadero_id");
        setSearchValue(parqueadero);
        const filtered = allEntradas.filter(
          (e) => e.parqueadero_id.toString() === parqueadero
        );
        setDisplayEntradas(filtered);
      } else {
        setDisplayEntradas(allEntradas);
      }
    };

    refreshEntradas();
  }, [searchParams]);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>
          <i className="fas fa-car"></i> SmartSpace - Entradas
        </h1>
        <p>Registro de ingresos y egresos de vehículos</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateEntrada}>
          <i className="fas fa-plus"></i> Nueva Entrada
        </button>
        <NavLink to="/entradas" className="btn btn-success">
          <i className="fas fa-sync-alt"></i> Actualizar
        </NavLink>

        <div className="search-container">
          <select
            className="form-select"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
          >
            <option value="">Buscar por...</option>
            <option value="placa">Placa</option>
            <option value="tipo_vehiculo">Tipo de vehículo</option>
            <option value="nombre">Nombre</option>
          </select>
          <input
            type="text"
            className="form-input"
            placeholder="Término de búsqueda..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-secondary" onClick={() => handleSearch()}>
            <i className="fas fa-search"></i> Buscar
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <i
            className={`fas ${
              alert.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }`}
          ></i>{" "}
          {alert.message}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Estadísticas */}
      <div
        className="stats"
        style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}
      >
        {Object.entries(vehiculosPorTipo).map(([tipo, count]) => (
          <div key={tipo} className="stat-card" style={{ flex: 1, textAlign: "center" }}>
            <div className="stat-number">{count}</div>
            <div className="stat-label">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando entradas...</p>
        </div>
      )}

      {/* Lista */}
      <section className="card">
        {!loading && displayEntradas.length === 0 ? (
          <p>No hay entradas registradas aún.</p>
        ) : (
          <EntradaList entradas={displayEntradas} onSalida={handleRegistrarSalida} />
        )}
      </section>

      {/* Modal */}
      <EntradaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        entrada={editingEntrada}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
