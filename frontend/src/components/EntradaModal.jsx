import React, { useState, useEffect } from "react";
import parqueaderoService from "../services/parqueaderoService";

const EntradaModal = ({ isOpen, onClose, entrada, onSubmit, espaciosLibres = {}, currentUserId }) => {
    const [formData, setFormData] = useState({
        placa: "",
        tipo_vehiculo: "automovil",
        parqueadero_id: "",
        controlador_id: currentUserId?.toString() || "1",
        espacio_asignado: ""
    });
    const [errors, setErrors] = useState({});
    const [globalMessage, setGlobalMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [parqueaderos, setParqueaderos] = useState([]);

    const isEditing = !!entrada;

    const irAEntradas = () => {
        navigate("/entradas");
    };

    // Cargar parqueaderos al abrir modal
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

    // Inicializar formData según entrada y parqueaderos
    useEffect(() => {
        if (!isOpen) return;

        if (entrada && parqueaderos.length > 0) {
            setFormData({
                placa: entrada.placa || "",
                tipo_vehiculo: entrada.tipo_vehiculo || "automovil",
                parqueadero_id: entrada.parqueadero_id?.toString() || parqueaderos[0].id.toString(),
                controlador_id: entrada.controlador_id?.toString() || currentUserId?.toString() || "1",
                espacio_asignado: entrada.espacio_asignado || ""
            });
        } else if (!entrada && parqueaderos.length > 0) {
            // Nuevo registro: preseleccionar primer parqueadero
            setFormData({
                placa: "",
                tipo_vehiculo: "automovil",
                parqueadero_id: parqueaderos[0].id.toString(),
                controlador_id: currentUserId?.toString() || "1",
                espacio_asignado: ""
            });
        } else {
            setFormData({
                placa: "",
                tipo_vehiculo: "automovil",
                parqueadero_id: "",
                controlador_id: currentUserId?.toString() || "1",
                espacio_asignado: ""
            });
        }

        setErrors({});
        setGlobalMessage("");
    }, [entrada, parqueaderos, isOpen, currentUserId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "parqueadero_id" ? { espacio_asignado: "" } : {})
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        setGlobalMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.placa.trim()) newErrors.placa = "Placa obligatoria";
        if (!["automovil", "moto", "camion", "otros"].includes(formData.tipo_vehiculo))
            newErrors.tipo_vehiculo = "Tipo de vehículo inválido";
        if (!formData.parqueadero_id) newErrors.parqueadero_id = "Parqueadero obligatorio";
        if (!formData.espacio_asignado.toString().trim()) newErrors.espacio_asignado = "Espacio asignado obligatorio";

        // Solo validar espacios libres al crear
        if (!isEditing && espaciosLibres[formData.tipo_vehiculo] <= 0)
            newErrors.tipo_vehiculo = "No hay espacios libres para este tipo de vehículo";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setGlobalMessage("");

        try {
            const dataToSend = {
                placa: formData.placa,
                tipo_vehiculo: formData.tipo_vehiculo,
                parqueadero_id: parseInt(formData.parqueadero_id),
                espacio_asignado: parseInt(formData.espacio_asignado),
                controlador_id: parseInt(formData.controlador_id),
            };

            const result = await onSubmit(dataToSend, entrada);

            if (result.success) {
                onClose();
                if (!entrada) {
                    setFormData(prev => ({
                        ...prev,
                        placa: "",
                        tipo_vehiculo: "automovil",
                        parqueadero_id: parqueaderos[0]?.id.toString() || "",
                        espacio_asignado: "",
                    }));
                    irAEntradas();
                }

            } else {
                setGlobalMessage(result.message || "Error al guardar la entrada");
            }
        } catch (err) {
            setGlobalMessage(err.message || "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
        irAEntradas();
    };

    const handleClose = () => {
        setFormData({
            placa: "",
            tipo_vehiculo: "automovil",
            parqueadero_id: parqueaderos[0]?.id.toString() || "",
            controlador_id: currentUserId?.toString() || "1",
            espacio_asignado: ""
        });
        setErrors({});
        setGlobalMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? "Editar Entrada" : "Nueva Entrada"}</h2>
                    <button className="close" onClick={handleClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {globalMessage && (
                        <div className={`global-message ${isEditing ? "info" : "error"}`}>
                            {globalMessage}
                        </div>
                    )}

                    {/* Placa */}
                    <div className="form-group">
                        <label>Placa *</label>
                        <input
                            type="text"
                            name="placa"
                            value={formData.placa}
                            onChange={handleChange}
                            className={errors.placa ? "error" : ""}
                        />
                        {errors.placa && <span className="error-message">{errors.placa}</span>}
                    </div>

                    {/* Tipo de vehículo */}
                    <div className="form-group">
                        <label>Tipo de vehículo *</label>
                        <select
                            name="tipo_vehiculo"
                            value={formData.tipo_vehiculo}
                            onChange={handleChange}
                            className={errors.tipo_vehiculo ? "error" : ""}
                        >
                            <option value="automovil">Automóvil </option>
                            <option value="moto">Moto </option>
                            <option value="camion">Camión </option>
                            <option value="otros">Otros</option>
                        </select>
                        {errors.tipo_vehiculo && <span className="error-message">{errors.tipo_vehiculo}</span>}
                    </div>

                    {/* Parqueadero */}
                    <div className="form-group">
                        <label>Parqueadero *</label>
                        <select
                            name="parqueadero_id"
                            value={formData.parqueadero_id}
                            onChange={handleChange}
                            className={errors.parqueadero_id ? "error" : ""}
                        >
                            <option value="">Seleccione un parqueadero...</option>
                            {parqueaderos.map(p => (
                                <option key={p.id} value={p.id.toString()}>{p.nombre}</option>
                            ))}
                        </select>
                        {errors.parqueadero_id && <span className="error-message">{errors.parqueadero_id}</span>}
                    </div>

                    {/* Espacio asignado */}
                    <div className="form-group">
                        <label>Espacio asignado *</label>
                        <input
                            type="number"
                            name="espacio_asignado"
                            value={formData.espacio_asignado}
                            onChange={handleChange}
                            className={errors.espacio_asignado ? "error" : ""}
                        />
                        {errors.espacio_asignado && <span className="error-message">{errors.espacio_asignado}</span>}
                    </div>

                    {/* Botones */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                        </button>

                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Registrar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EntradaModal;
