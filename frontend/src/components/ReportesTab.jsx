import React, { useState, useEffect } from "react";
import { reportesService } from "../services/reportesService";
import "./ReportesTab.css";

export default function ReportesTab() {
  const [ingresosTotales, setIngresosTotales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarIngresos();
  }, []);

  const cargarIngresos = async () => {
    setLoading(true);
    const result = await reportesService.getIngresosTotales();
    console.log("📊 Resultado bruto de reportesService:", result);
    console.log("📊 Datos recibidos:", result.data);
    if (result.success) {
      console.log("📊 Asignando ingresosTotales:", result.data);
      setIngresosTotales(result.data);
    }
    setLoading(false);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(valor);
  };

  if (loading) {
    return <div className="reportes-container">Cargando reportes...</div>;
  }

  const totalEntradas = ingresosTotales.reduce((sum, p) => sum + (parseInt(p.total_entradas) || 0), 0);
  const totalIngresos = ingresosTotales.reduce((sum, p) => sum + (parseFloat(p.ingresos_totales) || 0), 0);
  const promedioIngresos = totalEntradas > 0 ? totalIngresos / totalEntradas : 0;

  return (
    <div className="reportes-container">
      <h2>📊 Reportes de Ingresos</h2>

      <div className="resumen-general">
        <div className="card-resumen">
          <h3>Ingresos Totales</h3>
          <p className="monto-grande">
            {formatearMoneda(totalIngresos)}
          </p>
        </div>

        <div className="card-resumen">
          <h3>Total Entradas</h3>
          <p className="numero-grande">
            {totalEntradas}
          </p>
        </div>

        <div className="card-resumen">
          <h3>Promedio por Entrada</h3>
          <p className="monto-grande">
            {formatearMoneda(promedioIngresos)}
          </p>
        </div>
      </div>

      <div className="tabla-reportes">
        <h3>Ingresos por Parqueadero</h3>
        <table>
          <thead>
            <tr>
              <th>Parqueadero</th>
              <th>Entradas Totales</th>
              <th>Entradas Activas</th>
              <th>Entradas Completadas</th>
              <th>Ingresos Totales</th>
              <th>Ingreso Promedio</th>
            </tr>
          </thead>
          <tbody>
            {ingresosTotales.map((parq) => (
              <tr key={parq.id}>
                <td className="nombre-parq">{parq.nombre}</td>
                <td className="numero">{parq.total_entradas || 0}</td>
                <td className="numero">
                  <span className="badge badge-activa">{parq.entradas_activas || 0}</span>
                </td>
                <td className="numero">
                  <span className="badge badge-completada">
                    {parq.entradas_completadas || 0}
                  </span>
                </td>
                <td className="monto">{formatearMoneda(parq.ingresos_totales || 0)}</td>
                <td className="monto">{formatearMoneda(parq.ingreso_promedio || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
