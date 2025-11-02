import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserList from '../components/UserList';
import UserModal from '../components/UserModal';

const UsersPage = () => {
  const { users, loading, error, loadUsers, createUser, updateUser, deleteUser, searchUsers, getStats } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const stats = getStats();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleCreateUser = () => { setEditingUser(null); setShowModal(true); };
  const handleEditUser = (user) => { setEditingUser(user); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingUser(null); };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        const result = await updateUser(editingUser.id, formData);
        showAlert('success', result.message);
      } else {
        const result = await createUser(formData);
        showAlert('success', result.message);
      }
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const result = await deleteUser(id);
      showAlert('success', result.message);
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchCriteria && searchValue.trim()) {
        const resultados = await searchUsers(searchCriteria, searchValue);
        showAlert('success', `Se encontraron ${resultados.length} usuarios`);
      } else {
        await loadUsers();
      }
    } catch (error) {
      showAlert('error', error.message);
    }
  };


  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1><i className="fas fa-users"></i> SmartSpace - Usuarios</h1>
        <p>Sistema de Gestión de Usuarios</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleCreateUser}>
          <i className="fas fa-plus"></i> Nuevo Usuario
        </button>
        <button className="btn btn-success" onClick={loadUsers}>
          <i className="fas fa-sync-alt"></i> Actualizar
        </button>
        <div className="search-container">
          <select className="form-select" value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
            <option value="">Buscar por...</option>
            <option value="nombre">Nombre</option>
            <option value="email">Email</option>
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
          <div className="stat-label">Total Usuarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.administradores}</div>
          <div className="stat-label">Administradores</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.operadores}</div>
          <div className="stat-label">Operadores</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      )}

      {/* Users grid */}
      <section className="card">
        <h2></h2>
        {!loading && users.length === 0 ? (
          <p>No hay usuarios aún.</p>
        ) : (
          <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        )}
      </section>


      {/* Modal */}
      <UserModal isOpen={showModal} onClose={handleCloseModal} user={editingUser} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default UsersPage;
