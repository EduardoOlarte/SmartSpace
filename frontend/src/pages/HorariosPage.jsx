import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHorarios } from '../hooks/useHorarios';
import HorarioList from '../components/HorarioList';
import HorarioModal from '../components/HorarioModal';

const HorariosPage = () => {
  const { horarios, loading, error, loadHorarios, createHorario, updateHorario, deleteHorario, searchHorarios, getStats } = useHorarios();
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const stats = getStats();

  const [searchParams] = useSearchParams();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  useEffect(() => {
    const parqueadero = searchParams.get('parqueadero');
    if (parqueadero) {
      setSearchCriteria('nombre');
      setSearchValue(parqueadero);
      handleSearch(parqueadero);
    } else {
      loadHorarios();
    }
  }, [searchParams]);

  const handleFormSubmit = async (formData) => {
    try {
      // 🔹 Convertir parqueadero_id a número ya se hace en modal
      let result;
      if (editingHorario) {
        result = await updateHorario(editingHorario.id, formData);
      } else {
        result = await createHorario(formData);
      }

      if (result.success) {
        showAlert('success', result.message);
        loadHorarios();
        setShowModal(false);
        setEditingHorario(null);
      } else {
        showAlert('error', result.message);
      }
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleDeleteHorario = async (id) => {
    try {
      const result = await deleteHorario(id);
      if (result.success) showAlert('success', result.message);
      else showAlert('error', result.message);
      loadHorarios();
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleCreateHorario = () => { setEditingHorario(null); setShowModal(true); };
  const handleEditHorario = (horario) => { setEditingHorario(horario); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingHorario(null); };

  const handleSearch = async (value = searchValue) => {
    try {
      if (searchCriteria && value.trim()) {
        const resultados = await searchHorarios(searchCriteria, value.trim());
        showAlert('success', `Se encontraron ${resultados.length} horarios`);
      } else {
        await loadHorarios();
      }
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="container">
      <div className="header">
        <h1><i className="fas fa-calendar-alt"></i> SmartSpace - Horarios</h1>
        <p>Gestión de horarios de parqueaderos</p>
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateHorario}>
          <i className="fas fa-plus"></i> Nuevo Horario
        </button>
        <button className="btn btn-success" onClick={loadHorarios}>
          <i className="fas fa-sync-alt"></i> Actualizar
        </button>

        <div className="search-container">
          <select className="form-select" value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
            <option value="">Buscar por...</option>
            <option value="dia">Día</option>
            <option value="hora_inicio">Hora Inicio</option>
            <option value="hora_fin">Hora Fin</option>
            <option value="nombre">Parqueadero</option>
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

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Horarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.diasUnicos}</div>
          <div className="stat-label">Días únicos</div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      )}

      <section className="card">
        {!loading && horarios.length === 0 ? (
          <p>No hay horarios aún.</p>
        ) : (
          <HorarioList horarios={horarios} onEdit={handleEditHorario} onDelete={handleDeleteHorario} />
        )}
      </section>

      <HorarioModal isOpen={showModal} onClose={handleCloseModal} horario={editingHorario} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default HorariosPage;
