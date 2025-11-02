import React, { useState, useEffect } from "react";
import parqueaderoService from "../services/parqueaderoService";

const HorarioModal = ({ isOpen, onClose, horario, onSubmit }) => {
  const [formData, setFormData] = useState({
    parqueadero_id: "",
    dia_semana: "",
    hora_apertura: "",
    hora_cierre: "",
    activo: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parqueaderos, setParqueaderos] = useState([]);

  const isEditing = !!horario;

  const getDiasDisponibles = (diasOperacion) => {
    if (!diasOperacion) return [];
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const [inicio, fin] = diasOperacion.split('-').map(d => d.trim());
    const inicioIdx = dias.indexOf(inicio);
    const finIdx = dias.indexOf(fin);
    if (inicioIdx === -1 || finIdx === -1) return [];
    if (finIdx >= inicioIdx) return dias.slice(inicioIdx, finIdx + 1);
    return [...dias.slice(inicioIdx), ...dias.slice(0, finIdx + 1)];
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchParqueaderos = async () => {
      try {
        const result = await parqueaderoService.getAll();
        if (result.success && Array.isArray(result.data)) {
          setParqueaderos(result.data);
        }
      } catch (err) {
        console.error("Error cargando parqueaderos:", err);
      }
    };
    fetchParqueaderos();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (horario && parqueaderos.length > 0) {
      const parqueadero = parqueaderos.find(p => p.id === (horario.parqueadero_id || horario.parqueaderoId));
      const diasDisponibles = parqueadero ? getDiasDisponibles(parqueadero.dias_operacion) : [];

      setFormData({
        parqueadero_id: parqueadero?.id || "",
        dia_semana: diasDisponibles.includes(horario.dia_semana || horario.dia)
          ? horario.dia_semana || horario.dia
          : diasDisponibles[0] || "",
        hora_apertura: horario.hora_apertura || horario.hora_inicio || "",
        hora_cierre: horario.hora_cierre || horario.hora_fin || "",
        activo: horario.activo ?? true,
      });
    } else if (!horario && parqueaderos.length > 0) {
      // Nuevo horario: preseleccionar primer parqueadero y primer día
      const parqueadero = parqueaderos[0];
      const diasDisponibles = getDiasDisponibles(parqueadero.dias_operacion);
      setFormData({
        parqueadero_id: parqueadero.id,
        dia_semana: diasDisponibles[0] || "",
        hora_apertura: "",
        hora_cierre: "",
        activo: true,
      });
    } else {
      setFormData({
        parqueadero_id: "",
        dia_semana: "",
        hora_apertura: "",
        hora_cierre: "",
        activo: true,
      });
    }

    setErrors({});
  }, [horario, isOpen, parqueaderos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val,
      ...(name === "parqueadero_id" ? { dia_semana: "" } : {})
    }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.parqueadero_id) newErrors.parqueadero_id = "Debe seleccionar un parqueadero.";
    if (!formData.dia_semana.trim()) newErrors.dia_semana = "Debe especificar el día de la semana.";
    if (!formData.hora_apertura) newErrors.hora_apertura = "Debe ingresar hora de apertura.";
    if (!formData.hora_cierre) newErrors.hora_cierre = "Debe ingresar hora de cierre.";
    if (formData.hora_apertura && formData.hora_cierre && formData.hora_cierre <= formData.hora_apertura) {
      newErrors.hora_cierre = "La hora de cierre debe ser posterior a la apertura.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 🔹 Convertir parqueadero_id a número
      await onSubmit({ ...formData, parqueadero_id: Number(formData.parqueadero_id) });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      parqueadero_id: "",
      dia_semana: "",
      hora_apertura: "",
      hora_cierre: "",
      activo: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Horario" : "Crear Horario"}</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PARQUEADERO */}
          <div className="form-group">
            <label>Parqueadero *</label>
            <select
              name="parqueadero_id"
              value={formData.parqueadero_id}
              onChange={handleChange}
              required
              className={errors.parqueadero_id ? "error" : ""}
            >
              <option value="">Seleccione un parqueadero...</option>
              {parqueaderos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.parqueadero_id && <span className="error-message">{errors.parqueadero_id}</span>}
          </div>

          {/* DÍA SEMANA */}
          <div className="form-group">
            <label>Día de la semana *</label>
            <select
              name="dia_semana"
              value={formData.dia_semana}
              onChange={handleChange}
              required
              disabled={!formData.parqueadero_id}
            >
              <option value="">Seleccione un día...</option>
              {parqueaderos
                .filter(p => p.id === Number(formData.parqueadero_id))
                .flatMap(p => getDiasDisponibles(p.dias_operacion))
                .map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
            </select>
            {errors.dia_semana && <span className="error-message">{errors.dia_semana}</span>}
          </div>

          {/* HORAS */}
          <div className="form-group">
            <label>Hora apertura *</label>
            <input type="time" name="hora_apertura" value={formData.hora_apertura} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Hora cierre *</label>
            <input type="time" name="hora_cierre" value={formData.hora_cierre} onChange={handleChange} />
          </div>

          {/* ACTIVO */}
          <div className="form-group">
            <label>Estado *</label>
            <select
              name="activo"
              value={formData.activo ? "true" : "false"}
              onChange={e => setFormData(prev => ({ ...prev, activo: e.target.value === "true" }))}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {/* BOTONES */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioModal;
