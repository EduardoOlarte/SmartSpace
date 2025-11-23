import React, { useState, useEffect } from "react";
import parqueaderoService from "../services/parqueaderoService";

const TarifaModal = ({ isOpen, onClose, tarifa, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo_calculo: "por_hora",
    tipo_vehiculo: "moto",
    parqueadero_id: "",
    dia_semana: "Todos",
    hora_inicio: "",
    hora_fin: "",
    precio: "",
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parqueaderos, setParqueaderos] = useState([]);

  const isEditing = !!tarifa;

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
    if (tarifa) {
      setFormData({
        nombre: tarifa.nombre || "",
        descripcion: tarifa.descripcion || "",
        tipo_calculo: tarifa.tipo_calculo || "por_hora",
        tipo_vehiculo: tarifa.tipo_vehiculo || "moto",
        parqueadero_id: tarifa.parqueadero_id?.toString() || "",
        dia_semana: tarifa.dia_semana || "Todos",
        hora_inicio: tarifa.hora_inicio?.slice(0, 5) || "",
        hora_fin: tarifa.hora_fin?.slice(0, 5) || "",
        precio: tarifa.precio?.toString() || "",
        activo: tarifa.activo ?? true
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        tipo_calculo: "por_hora",
        tipo_vehiculo: "moto",
        parqueadero_id: "",
        dia_semana: "Todos",
        hora_inicio: "",
        hora_fin: "",
        precio: "",
        activo: true
      });
    }
    setErrors({});
  }, [tarifa, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre obligatorio";
    if (!formData.precio || parseFloat(formData.precio) < 0) {
      newErrors.precio = "Precio inválido";
    }
    if (formData.hora_inicio && formData.hora_fin) {
      if (formData.hora_fin <= formData.hora_inicio) {
        newErrors.hora_fin = "La hora fin debe ser posterior a la hora inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        parqueadero_id: formData.parqueadero_id ? parseInt(formData.parqueadero_id) : null,
        precio: parseFloat(formData.precio),
        hora_inicio: formData.hora_inicio || null,
        hora_fin: formData.hora_fin || null
      };

      await onSubmit(dataToSend);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipo_calculo: "por_hora",
      tipo_vehiculo: "moto",
      parqueadero_id: "",
      dia_semana: "Todos",
      hora_inicio: "",
      hora_fin: "",
      precio: "",
      activo: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Tarifa" : "Crear Tarifa"}</h2>
          <button className="close" onClick={handleClose}>&times;</button>
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
              className={errors.nombre ? "error" : ""}
              placeholder="Ej: Tarifa Hora - Automóvil"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="2"
              placeholder="Descripción opcional de la tarifa"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "16px"
              }}
            />
          </div>

          {/* Tipo de Cálculo */}
          <div className="form-group">
            <label>Tipo de Cálculo *</label>
            <select
              name="tipo_calculo"
              value={formData.tipo_calculo}
              onChange={handleChange}
            >
              <option value="por_hora">Por Hora</option>
              <option value="por_dia">Por Día</option>
            </select>
          </div>

          {/* Tipo de Vehículo */}
          <div className="form-group">
            <label>Tipo de Vehículo *</label>
            <select
              name="tipo_vehiculo"
              value={formData.tipo_vehiculo}
              onChange={handleChange}
            >
              <option value="moto">Moto</option>
              <option value="automovil">Automóvil</option>
              <option value="camion">Camión</option>
            </select>
          </div>

          {/* Parqueadero (opcional) */}
          <div className="form-group">
            <label>Parqueadero (opcional)</label>
            <select
              name="parqueadero_id"
              value={formData.parqueadero_id}
              onChange={handleChange}
            >
              <option value="">Todos los parqueaderos</option>
              {parqueaderos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Día de la Semana */}
          <div className="form-group">
            <label>Día de la Semana</label>
            <select
              name="dia_semana"
              value={formData.dia_semana}
              onChange={handleChange}
            >
              <option value="Todos">Todos los días</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>

          {/* Horario (opcional) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Hora Inicio (opcional)</label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Hora Fin (opcional)</label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                className={errors.hora_fin ? "error" : ""}
              />
              {errors.hora_fin && <span className="error-message">{errors.hora_fin}</span>}
            </div>
          </div>

          {/* Precio */}
          <div className="form-group">
            <label>Precio (COP) *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={errors.precio ? "error" : ""}
              placeholder="Ej: 3000"
              min="0"
              step="100"
            />
            {errors.precio && <span className="error-message">{errors.precio}</span>}
          </div>

          {/* Estado */}
          <div className="form-group">
            <label>Estado</label>
            <select
              name="activo"
              value={formData.activo ? "true" : "false"}
              onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.value === "true" }))}
            >
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <i className="fas fa-save"></i> {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TarifaModal;