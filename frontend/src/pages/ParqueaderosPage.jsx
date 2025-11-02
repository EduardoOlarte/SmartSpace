import React, { useState, useEffect } from "react";
import { useParqueaderos } from "../hooks/useParqueaderos";
import ParqueaderoList from "../components/ParqueaderoList";
import ParqueaderoModal from "../components/ParqueaderoModal";

export default function ParqueaderosPage() {
  const {
    parqueaderos,
    loading,
    error,
    loadParqueaderos,
    createParqueadero,
    updateParqueadero,
    deleteParqueadero,
    searchParqueaderos,
    getStats,
  } = useParqueaderos();

  const [showModal, setShowModal] = useState(false);
  const [editingParqueadero, setEditingParqueadero] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const stats = getStats();

  useEffect(() => {
    loadParqueaderos();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const handleCreateParqueadero = () => {
    setEditingParqueadero(null);
    setShowModal(true);
  };

  const handleEditParqueadero = (p) => {
    setEditingParqueadero(p);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingParqueadero(null);
  };

const handleFormSubmit = async (formData) => {
  try {
    let result;
    if (editingParqueadero) {
      result = await updateParqueadero(editingParqueadero.id, formData);
      showAlert("success", "Parqueadero actualizado correctamente");
    } else {
      result = await createParqueadero(formData);
      showAlert("success", "Parqueadero creado correctamente");
    }

    handleCloseModal();
    await loadParqueaderos();
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    showAlert("error", msg);
  }
};



  const handleDeleteParqueadero = async (id) => {
    if (!window.confirm("¿Eliminar este parqueadero?")) return;
    try {
      await deleteParqueadero(id);
      showAlert("success", "Parqueadero eliminado");
      if (editingParqueadero?.id === id) handleCloseModal();
      await loadParqueaderos();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert("error", msg);
    }
  };

const handleSearch = async () => {
  try {
    if (searchCriteria && searchValue.trim()) {
      // Validación para campo numérico
      if (searchCriteria === "capacidad" && isNaN(searchValue.trim())) {
        showAlert("error", "La capacidad debe ser un número");
        return;
      }

      const resultados = await searchParqueaderos(searchCriteria, searchValue.trim());
      showAlert("success", `Se encontraron ${resultados.length} parqueaderos`);
    } else {
      await loadParqueaderos();
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    showAlert("error", msg);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1><i className="fas fa-parking"></i> SmartSpace - Parqueaderos</h1>
        <p>Sistema de Gestión de Parqueaderos</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateParqueadero}>
          <i className="fas fa-plus"></i> Nuevo Parqueadero
        </button>
        <button className="btn btn-success" onClick={loadParqueaderos}>
          <i className="fas fa-sync-alt"></i> Actualizar
        </button>

        <div className="search-container">
          <select
            className="form-select"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
          >
            <option value="">Buscar por...</option>
            <option value="nombre">Nombre</option>
            <option value="ubicacion">Ubicación</option>
            <option value="capacidad">Capacidad</option>
          </select>
          <input
            type="text"
            className="form-input"
            placeholder="Término de búsqueda..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>
            <i className="fas fa-search"></i> Buscar
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <i className={`fas ${alert.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          <span>{alert.message}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.capacidadTotal}</div>
          <div className="stat-label">Capacidad total</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando parqueaderos...</p>
        </div>
      )}

      {/* Parqueaderos list */}
      <section className="card">
        {!loading && parqueaderos.length === 0 ? (
          <p>No hay parqueaderos aún.</p>
        ) : (
          <ParqueaderoList
            parqueaderos={parqueaderos}
            onEdit={handleEditParqueadero}
            onDelete={handleDeleteParqueadero}
          />
        )}
      </section>

      {/* Modal */}
      <ParqueaderoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        parqueadero={editingParqueadero}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
