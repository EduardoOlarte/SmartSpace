import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;

      if (tipo === "usuario") {
        if (!nombre || !password) {
          setError("Nombre y contraseña son obligatorios");
          setLoading(false);
          return;
        }
        res = await authService.loginUsuario({ nombre, password });
      } else {
        if (!nombre || !identificacion) {
          setError("Nombre e identificación son obligatorios");
          setLoading(false);
          return;
        }
        res = await authService.loginControlador({ nombre, identificacion });
      }

      if (!res.success) {
        setError(res.message || "Error en el login");
        setLoading(false);
        return;
      }

      const userData =
        tipo === "usuario"
          ? { id: res.data.id, nombre: res.data.nombre, rol: res.data.rol }
          : { id: res.data.id, nombre: res.data.nombre, rol: "controlador" };

      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.rol === "administrador") navigate("/usuarios");
      else if (userData.rol === "operador") navigate("/controladores");
      else if (userData.rol === "controlador") navigate("/entradas");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#00a2ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px",
      }}
    >
      <div
        className="login-card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        {/* Encabezado */}
        <div style={{ marginBottom: 24 }}>
          <i
            className="fas fa-parking"
            style={{ fontSize: "40px", color: "#059669", marginBottom: 8 }}
          ></i>
          <h2 style={{ marginBottom: 4 }}>SmartSpace</h2>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Sistema de Control de Parqueaderos
          </p>
        </div>

        {/* Selector de tipo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <label>
            <input
              type="radio"
              value="usuario"
              checked={tipo === "usuario"}
              onChange={() => setTipo("usuario")}
              style={{ marginRight: 6 }}
            />
            Usuario
          </label>
          <label>
            <input
              type="radio"
              value="controlador"
              checked={tipo === "controlador"}
              onChange={() => setTipo("controlador")}
              style={{ marginRight: 6 }}
            />
            Controlador
          </label>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />

          {tipo === "usuario" ? (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />
          ) : (
            <input
              type="text"
              placeholder="Identificación"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 0",
              backgroundColor: "#059669",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#047857")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#059669")}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Ingresando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Ingresar
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{ marginTop: 24, fontSize: "13px", color: "#9ca3af" }}>
          © 2025 SmartSpace — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
