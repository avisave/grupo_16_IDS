import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Usuarios", path: "/dashboard/usuarios" },
    { name: "Clientes", path: "/dashboard/clientes" },
    { name: "Obras", path: "/dashboard/obras" },
    { name: "Tareas", path: "/dashboard/tareas" },
    { name: "Solicitudes", path: "/dashboard/solicitudes" },
  ];

  return (
    <div 
      style={{ 
        display: "flex", 
        width: "100vw", 
        height: "100vh", 
        maxHeight: "100vh",
        background: "#f8fafc", 
        margin: 0, 
        padding: 0, 
        overflow: "hidden", 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "fixed",
        top: 0,
        left: 0
      }}
    >
      
      {/* MENÚ LATERAL FIJO */}
      <aside 
        style={{ 
          width: "260px", 
          minWidth: "260px",
          background: "#0f1115", 
          height: "100vh",
          display: "flex", 
          flexDirection: "column", 
          padding: "24px 16px", 
          boxSizing: "border-box"
        }}
      >
        <div 
          style={{ marginBottom: "28px", paddingLeft: "12px", cursor: "pointer" }} 
          onClick={() => navigate("/dashboard")}
        >
          <h2 style={{ color: "#ffffff", fontSize: "15px", margin: 0, fontWeight: "700", letterSpacing: "0.5px" }}>
            Puertas Blindadas
          </h2>
          <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600", marginTop: "2px" }}>
            Panel de Operaciones
          </div>
        </div>

        <nav style={{ flexGrow: 1, overflowY: "auto" }}>
            <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", padding: "0 12px 10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Módulos
            </div>
          
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  color: isActive ? "#ffffff" : "#9ca3af",
                  background: isActive ? "#ea580c" : "transparent",
                  fontSize: "14px",
                  fontWeight: isActive ? "700" : "500",
                  cursor: "pointer",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ width: "16px", height: "16px", border: isActive ? "2px solid #ffffff" : "2px solid #4b5563", borderRadius: "4px", opacity: isActive ? 1 : 0.6 }}></div>
                {item.name}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main 
        style={{ 
          flexGrow: 1, 
          height: "100vh",
          display: "flex", 
          flexDirection: "column", 
          padding: "40px", 
          boxSizing: "border-box",
          overflowY: "auto",
          background: "#ffffff"
        }}
      >
        {location.pathname === "/dashboard" ? (
          /* MENSAJE DE BIENVENIDA INICIAL (FIJO AL ENTRAR AL DASHBOARD) */
          <div style={{ display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "70vh" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "#ffedd5", color: "#ea580c", display: "flex", alignItems: "center", justify: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "24px", boxShadow: "0 4px 12px rgba(234, 88, 12, 0.15)" }}>
              P
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>
              ¡Bienvenido al Sistema de Control Visual!
            </h1>
            <p style={{ margin: 0, fontSize: "16px", color: "#64748b", maxWidth: "520px", lineHeight: "1.6" }}>
              Por favor, selecciona cualquiera de los módulos operativos en el menú lateral izquierdo para gatillar el acceso a su correspondiente página.
            </p>
          </div>
        ) : (
          /* LAS SUB-RUTAS SE MONTAN AQUÍ MANTENIENDO EL SIDEBAR */
          <Outlet />
        )}
      </main>

    </div>
  );
};

export default Dashboard;
