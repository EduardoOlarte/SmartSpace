import React, { useState, useEffect } from "react";

const ControllerModal = ({ isOpen, onClose, controller, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    identificacion: "",
    telefono: "",
    rol: "operador",
    activo: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!controller;

  useEffect(() => {
    if (controller) {
      setFormData({
        nombre: controller.nombre || "",
        identificacion: controller.identificacion || "",
        telefono: controller.telefono || "",
        rol: controller.rol || "operador",
        activo: controller.activo ?? true,
      });
    } else {
      setFormData({
        nombre: "",
        identificacion: "",
        telefono: "",
        rol: "operador",
        activo: true,
      });
    }
    setErrors({});
  }, [controller, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "activo" ? value === "true" : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre obligatorio";
    if (!formData.identificacion.trim()) newErrors.identificacion = "Identificación obligatoria";
    if (!["operador", "supervisor"].includes(formData.rol)) newErrors.rol = "Rol inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (isEditing) delete dataToSend.identificacion; // no modificar ID al editar
      await onSubmit(dataToSend);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: "", identificacion: "", telefono: "", rol: "operador", activo: true });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Controlador" : "Crear Controlador"}</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "error" : ""}
              required
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Identificación *</label>
            <input
              type="text"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              className={errors.identificacion ? "error" : ""}
              required
              disabled={isEditing}
            />
            {errors.identificacion && <span className="error-message">{errors.identificacion}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Rol *</label>
            <select name="rol" value={formData.rol} onChange={handleChange} required>
              <option value="operador">Operador</option>
              <option value="supervisor">Supervisor</option>
            </select>
            {errors.rol && <span className="error-message">{errors.rol}</span>}
          </div>

          <div className="form-group">
            <label>Activo *</label>
            <select name="activo" value={formData.activo ? "true" : "false"} onChange={handleChange} required>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

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

export default ControllerModal;
