import express from "express";
import cors from "cors";

// Importar rutas
import controllerRoutes from "./routes/controllerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import parqueaderoRoutes from "./routes/parqueaderoRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js"; // ✅ Nueva ruta de horarios
import entradasRoutes from "./routes/entradasRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ Ruta de login

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/controllers", controllerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parqueaderos", parqueaderoRoutes);
app.use("/api/horarios", horarioRoutes); // ✅ Montar ruta de horarios
app.use("/api/auth", authRoutes); // ✅ Montar ruta de login
app.use("/api/entradas", entradasRoutes);

export default app;
