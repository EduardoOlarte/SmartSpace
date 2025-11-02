import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import UsersPage from "./pages/UsersPage";
import ControllersPage from "./pages/ControllersPage";
import ParkingsPage from "./pages/ParqueaderosPage";
import HorariosPage from "./pages/HorariosPage";
import EntradasPage from "./pages/EntradasPage";
import LoginPage from "./pages/LoginPage";
import { authService } from "./services/authService";

function AppLayout() {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const hideNavbar = location.pathname === "/login";

  const ProtectedRoute = ({ roles, element }) => {
    if (!user) return <Navigate to="/login" />;
    if (!roles.includes(user.rol)) return <Navigate to="/login" />;
    return element;
  };

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container">
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Usuarios */}
          <Route
            path="/usuarios"
            element={<ProtectedRoute roles={["administrador"]} element={<UsersPage />} />}
          />

          {/* Controladores */}
          <Route
            path="/controladores"
            element={<ProtectedRoute roles={["administrador", "operador"]} element={<ControllersPage />} />}
          />

          {/* Parqueaderos */}
          <Route
            path="/parqueaderos"
            element={<ProtectedRoute roles={["administrador", "operador"]} element={<ParkingsPage />} />}
          />

          {/* Horarios */}
          <Route
            path="/horarios"
            element={<ProtectedRoute roles={["administrador", "operador"]} element={<HorariosPage />} />}
          />

          {/* Entradas */}
          <Route
            path="/entradas"
            element={<ProtectedRoute roles={["administrador", "operador", "controlador"]} element={<EntradasPage />} />}
          />

          {/* Ruta raíz - redirige según rol */}
          <Route
            path="/"
            element={
              user ? (
                user.rol === "administrador" ? (
                  <Navigate to="/usuarios" />
                ) : user.rol === "operador" ? (
                  <Navigate to="/controladores" />
                ) : user.rol === "controlador" ? (
                  <Navigate to="/entradas" />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
