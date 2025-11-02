import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // No mostrar navbar si no hay usuario

  return (
    <nav className="navbar" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <ul className="navbar-links" style={{ display: "flex", gap: "12px", listStyle: "none", margin: 0, padding: 0 }}>
        {/* Usuarios - solo admins */}
        {user.rol === "administrador" && (
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}
            >
              <i className="fas fa-users"></i> Usuarios
            </NavLink>
          </li>
        )}

        {/* Controladores, Parqueaderos, Horarios y Entradas - admin u operador */}
        {(user.rol === "administrador" || user.rol === "operador") && (
          <>
            <li>
              <NavLink
                to="/controladores"
                className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}
              >
                <i className="fas fa-microchip"></i> Controladores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/parqueaderos"
                className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}
              >
                <i className="fas fa-parking"></i> Parqueaderos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/horarios"
                className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}
              >
                <i className="fas fa-clock"></i> Horarios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/entradas"
                className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}
              >
                <i className="fas fa-sign-in-alt"></i> Entradas
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <button
        onClick={handleLogout}
        onMouseEnter={() => setHoverLogout(true)}
        onMouseLeave={() => setHoverLogout(false)}
        style={{
          marginLeft: "auto",
          padding: "6px 12px",
          backgroundColor: hoverLogout ? "#e53e3e" : "#dc2626",
          transform: hoverLogout ? "scale(1.05)" : "scale(1)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
