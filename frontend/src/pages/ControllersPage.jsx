import React, { useState } from 'react';
import { useControllers } from '../hooks/useControllers';
import ControllerList from '../components/ControllerList';
import ControllerModal from '../components/ControllerModal';

const ControllersPage = () => {
  const {
    controllers,
    loading,
    error,
    loadControllers,
    createController,
    updateController,
    deleteController,
    searchControllers,
    getStats,
  } = useControllers();

  const [showModal, setShowModal] = useState(false);
  const [editingController, setEditingController] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const stats = getStats();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleCreateController = () => {
    setEditingController(null);
    setShowModal(true);
  };

  const handleEditController = (controller) => {
    setEditingController(controller);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingController(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (editingController) {
        result = await updateController(editingController.id, formData);
      } else {
        result = await createController(formData);
      }

      showAlert('success', result.message); // siempre mostrar mensaje del backend
      handleCloseModal();
      await loadControllers(); // refrescar lista
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert('error', msg);
    }
  };

  const handleDeleteController = async (id) => {
    if (!window.confirm('¿Eliminar este controlador?')) return;
    try {
      const result = await deleteController(id);
      showAlert('success', result.message);
      if (editingController?.id === id) handleCloseModal();
      await loadControllers(); // refrescar lista
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert('error', msg);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchCriteria && searchValue.trim()) {
        // Usamos el resultado de la búsqueda directamente
        const resultados = await searchControllers(searchCriteria, searchValue);
        showAlert('success', `Se encontraron ${resultados.length} controladores`);
      } else {
        await loadControllers();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showAlert('error', msg);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1><i className="fas fa-cogs"></i> SmartSpace - Controladores</h1>
        <p>Sistema de Gestión de Controladores</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateController}>
          <i className="fas fa-plus"></i> Nuevo Controlador
        </button>
        <button className="btn btn-success" onClick={loadControllers}>
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
            <option value="identificacion">Identificación</option>
            <option value="rol">Rol</option>
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
          <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
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
          <div className="stat-label">Total Controladores</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.supervisores}</div>
          <div className="stat-label">Supervisores</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.operadores}</div>
          <div className="stat-label">Operadores</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activos}</div>
          <div className="stat-label">Activos</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando controladores...</p>
        </div>
      )}

      {/* Controllers list */}
      <section className="card">
        {!loading && controllers.length === 0 ? (
          <p>No hay controladores aún.</p>
        ) : (
          <ControllerList
            controllers={controllers}
            onEdit={handleEditController}
            onDelete={handleDeleteController}
          />
        )}
      </section>

      {/* Modal */}
      <ControllerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        controller={editingController}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ControllersPage;
