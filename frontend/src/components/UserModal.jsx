import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'operador'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '',
        rol: user.rol || 'operador'
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'operador'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (isEditing && formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!['administrador', 'operador'].includes(formData.rol)) {
      newErrors.rol = 'Rol inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (isEditing && !dataToSend.password) delete dataToSend.password;
      await onSubmit(dataToSend);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: '', email: '', password: '', rol: 'operador' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
              required
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder={isEditing ? 'Dejar vacío para no cambiar' : ''}
              required={!isEditing}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Rol *</label>
            <select name="rol" value={formData.rol} onChange={handleChange} required>
              <option value="">Seleccionar rol...</option>
              <option value="operador">Operador</option>
              <option value="administrador">Administrador</option>
            </select>
            {errors.rol && <span className="error-message">{errors.rol}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <i className="fas fa-save"></i> {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
