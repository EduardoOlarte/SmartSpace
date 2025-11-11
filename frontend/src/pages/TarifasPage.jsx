import React, { useState } from "react";
import { useTarifas } from "../hooks/useTarifas";
import TarifaList from "../components/TarifaList";
import TarifaModal from "../components/TarifaModal";

const TarifasPage = () => {
  const {
    tarifas,
    loading,
    error,
    loadTarifas,
    createTarifa,
    updateTarifa,
    deleteTarifa,
    searchTarifas,
    getStats,
  } = useTarifas();

  const [showModal, setShowModal] = useState(false);
  const [editingTarifa, setEditingTarifa] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const stats = getStats();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const handleCreateTarifa = () => {
    setEditingTarifa(null);
    setShowModal(true);
  };

  const handleEditTarifa = (tarifa) => {
    setEditingTarifa(tarifa);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTarifa(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (editingTarifa) {
        result = await updateTarifa(editingTarifa.id, formData);
      } else {
        result = await createTarifa(formData);
      }

      showAlert("success", result.message);
      handleCloseModal();
      await loadTarifas();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert("error", msg);
    }
  };

  const handleDeleteTarifa = async (id) => {
    if (!window.confirm("¿Eliminar esta tarifa?")) return;
    try {
      const result = await deleteTarifa(id);
      showAlert("success", result.message);
      if (editingTarifa?.id === id) handleCloseModal();
      await loadTarifas();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert("error", msg);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchCriteria && searchValue.trim()) {
        const resultados = await searchTarifas(searchCriteria, searchValue);
        showAlert("success", `Se encontraron ${resultados.length} tarifas`);
      } else {
        await loadTarifas();
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
        <h1>
          <i className="fas fa-dollar-sign"></i> SmartSpace - Tarifas
        </h1>
        <p>Sistema de Gestión de Tarifas de Parqueadero</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateTarifa}>
          <i className="fas fa-plus"></i> Nueva Tarifa
        </button>
        <button className="btn btn-success" onClick={loadTarifas}>
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
            <option value="tipo_calculo">Tipo de Cálculo</option>
            <option value="tipo_vehiculo">Tipo de Vehículo</option>
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
          <i
            className={`fas ${
              alert.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }`}
          ></i>
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
          <div className="stat-label">Total Tarifas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activas}</div>
          <div className="stat-label">Activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.porHora}</div>
          <div className="stat-label">Por Hora</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.porDia}</div>
          <div className="stat-label">Por Día</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tarifas...</p>
        </div>
      )}

      {/* Tarifas list */}
      <section className="card">
        {!loading && tarifas.length === 0 ? (
          <p>No hay tarifas aún.</p>
        ) : (
          <TarifaList
            tarifas={tarifas}
            onEdit={handleEditTarifa}
            onDelete={handleDeleteTarifa}
          />
        )}
      </section>

      {/* Modal */}
      <TarifaModal
        isOpen={showModal}
        onClose={handleCloseModal}
        tarifa={editingTarifa}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default TarifasPage;