import express from "express";
import cors from "cors";

// Importar rutas
import controllerRoutes from "./routes/controllerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import parqueaderoRoutes from "./routes/parqueaderoRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js";
import entradasRoutes from "./routes/entradasRoutes.js";
import tarifasRoutes from "./routes/tarifaRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/controllers", controllerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parqueaderos", parqueaderoRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/entradas", entradasRoutes);
app.use("/api/tarifas", tarifasRoutes);
app.use("/api/reportes", reportesRoutes); 

// ✅ Ruta raíz para Render
app.get("/", (req, res) => {
  res.send(" Backend del Parqueadero corriendo correctamente en Render!");
});

export default app;
