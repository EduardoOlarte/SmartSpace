import React, { useState, useEffect } from 'react';

const ParqueaderoModal = ({ isOpen, onClose, parqueadero, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad: '',
    ubicacion: '',
    ciudad: '',
    dia_inicio: '',
    dia_fin: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!parqueadero;

  useEffect(() => {
    if (parqueadero) {
      const dias = parqueadero.dias_operacion?.split('-') || [];
      setFormData({
        nombre: parqueadero.nombre || '',
        capacidad: parqueadero.capacidad?.toString() || '',
        ubicacion: parqueadero.ubicacion || '',
        ciudad: parqueadero.ciudad || '',
        dia_inicio: dias[0] || '',
        dia_fin: dias[1] || ''
      });
    } else {
      setFormData({
        nombre: '',
        capacidad: '',
        ubicacion: '',
        ciudad: '',
        dia_inicio: '',
        dia_fin: ''
      });
    }
    setErrors({});
  }, [parqueadero, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre obligatorio';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'Ubicación obligatoria';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad obligatoria';

    const capacidadNum = parseInt(formData.capacidad, 10);
    if (isNaN(capacidadNum) || capacidadNum <= 0)
      newErrors.capacidad = 'Capacidad inválida';

    if (!formData.dia_inicio) newErrors.dia_inicio = 'Seleccione un día de inicio';
    if (!formData.dia_fin) newErrors.dia_fin = 'Seleccione un día de fin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacidad: parseInt(formData.capacidad, 10),
        dias_operacion: `${formData.dia_inicio}-${formData.dia_fin}`
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      capacidad: '',
      ubicacion: '',
      ciudad: '',
      dia_inicio: '',
      dia_fin: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const diasSemana = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Parqueadero' : 'Crear Parqueadero'}</h2>
          <button className="close" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          {/* Capacidad */}
          <div className="form-group">
            <label>Capacidad *</label>
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min={1}
            />
            {errors.capacidad && <span className="error-message">{errors.capacidad}</span>}
          </div>

          {/* Ubicación */}
          <div className="form-group">
            <label>Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
            />
            {errors.ubicacion && <span className="error-message">{errors.ubicacion}</span>}
          </div>

          {/* Ciudad */}
          <div className="form-group">
            <label>Ciudad *</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
            {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
          </div>

          {/* Días de operación */}
          <div className="form-group">
            <label>Día de inicio *</label>
            <select
              name="dia_inicio"
              value={formData.dia_inicio}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
            {errors.dia_inicio && <span className="error-message">{errors.dia_inicio}</span>}
          </div>

          <div className="form-group">
            <label>Día de fin *</label>
            <select
              name="dia_fin"
              value={formData.dia_fin}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
            {errors.dia_fin && <span className="error-message">{errors.dia_fin}</span>}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParqueaderoModal;
