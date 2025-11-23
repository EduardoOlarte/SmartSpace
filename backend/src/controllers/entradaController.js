import * as EntradaModel from "../models/entradasModel.js";
import * as TarifaModel from "../models/tarifaModel.js"; 

// ==========================
// Obtener todas las entradas
// ==========================
export const obtenerEntradas = async (req, res) => {
  try {
    const entradas = await EntradaModel.getAllEntradas();
    res.json(entradas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las entradas", error: error.message });
  }
};

// ==========================
// Obtener una entrada por ID
// ==========================
export const obtenerEntrada = async (req, res) => {
  try {
    const entrada = await EntradaModel.getEntradaById(req.params.id);
    if (!entrada) return res.status(404).json({ message: "Entrada no encontrada" });
    res.json(entrada);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la entrada", error: error.message });
  }
};

// ==========================
// Crear nueva entrada
// ==========================
export const crearEntrada = async (req, res) => {
  try {
    const nuevo = await EntradaModel.createEntrada(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    if (/duplicidad|capacidad/i.test(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al crear la entrada", error: error.message });
  }
};

// ==========================
// Actualizar una entrada
// ==========================
export const actualizarEntrada = async (req, res) => {
  try {
    const actualizado = await EntradaModel.updateEntrada(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ message: "Entrada no encontrada" });
    res.json(actualizado);
  } catch (error) {
    if (/duplicidad|capacidad/i.test(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al actualizar la entrada", error: error.message });
  }
};

// ==========================
// Eliminar una entrada
// ==========================
export const eliminarEntrada = async (req, res) => {
  try {
    await EntradaModel.removeEntrada(req.params.id);
    res.json({ message: "Entrada eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la entrada", error: error.message });
  }
};

// ==========================
// Buscar entradas
// ==========================
export const buscarEntradas = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await EntradaModel.searchEntradas(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de entradas", error: error.message });
  }
};

// ==========================
// 🔹 Registrar salida (corregido)
// ==========================
export const registrarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    const hora_salida = new Date();

    //  Obtener la entrada actual
    const entrada = await EntradaModel.getEntradaById(id);
    if (!entrada) {
      return res.status(404).json({
        success: false,
        message: "Entrada no encontrada"
      });
    }

    //  Verificar si ya tiene salida registrada
    if (entrada.hora_salida) {
      return res.status(400).json({
        success: false,
        message: "Esta entrada ya tiene una salida registrada"
      });
    }

    //  Calcular el monto cobrado usando tipo_cobro almacenado
    let monto_cobrado = 0;
    try {
      const calculoTarifa = await TarifaModel.calcularTarifa({
        tipo_vehiculo: entrada.tipo_vehiculo,
        parqueadero_id: entrada.parqueadero_id,
        hora_ingreso: entrada.hora_ingreso,
        hora_salida,
        tipo_cobro: entrada.tipo_cobro // 🔹 USAR tipo_cobro de la entrada
      });
      monto_cobrado = calculoTarifa.monto_total;
    } catch (tarifaError) {
      console.log("No se pudo calcular tarifa:", tarifaError.message);
    }

    //  Actualizar la entrada con todos los datos obligatorios
    const actualizado = await EntradaModel.updateEntrada(id, {
      placa: entrada.placa,                       //  mantener placa
      tipo_vehiculo: entrada.tipo_vehiculo,       //  mantener tipo
      parqueadero_id: entrada.parqueadero_id,     //  mantener parqueadero
      controlador_id: entrada.controlador_id,     //  mantener controlador
      espacio_asignado: entrada.espacio_asignado, //  mantener espacio
      tipo_cobro: entrada.tipo_cobro,             //  mantener tipo_cobro
      hora_salida,                                //  nueva hora salida
      estado: "cerrada",                          //  cambiar estado
      monto_cobrado                               //  guardar monto
    });

    // 5️⃣ Enviar respuesta al cliente
    return res.json({
      success: true,
      message: monto_cobrado > 0
        ? `Salida registrada. Monto a cobrar: $${monto_cobrado.toLocaleString("es-CO")}`
        : "Salida registrada correctamente",
      data: actualizado
    });

  } catch (error) {
    console.error("Error al registrar salida:", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar salida",
      error: error.message
    });
  }
};
