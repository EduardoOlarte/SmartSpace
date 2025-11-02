import jwt from "jsonwebtoken";
const SECRET = "supersecreto";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

// Middleware para verificar rol
export const roleMiddleware = (rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
};
