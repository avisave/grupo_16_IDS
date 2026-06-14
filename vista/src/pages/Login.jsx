import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const validarRut = (v) => /^\d{7,8}-[\dkK]$/.test(v.trim());

  const handleRutChange = (e) => {
    let v = e.target.value;
    v = v.replace(/[^\dKk-]/g, '').toUpperCase();
    if (v.length > 1 && !v.includes('-') && v.length <= 9) {
      v = v.slice(0, -1) + '-' + v.slice(-1);
    }
    setRut(v);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validarRut(rut)) {
      alert("RUT inválido. Debe tener formato XXXXXXXX-X (ej: 12345678-9)");
      return;
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut, contrasena: password })
      });
      const data = await res.json();
      if (data.success) {
        login(data.usuario);
        navigate("/dashboard");
      } else {
        alert(data.mensaje || "Credenciales incorrectas");
      }
    } catch {
      alert("Error de conexión con el servidor");
    }
  };

  const handleBypass = () => {
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: 0,
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
          border: "none"
        }}
      >
        <div 
          style={{ 
            background: "#000000", 
            padding: "24px", 
            textAlign: "center",
            borderTop: "4px solid #ea580c"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "4px",
              marginBottom: "12px",
              fontWeight: "bold",
              color: "#000",
              fontSize: "14px",
              letterSpacing: "0.5px"
            }}
          >
            Puertas Blindadas
          </div>
          <h2 style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", margin: 0 }}>
            SISTEMA DE GESTIÓN ERP
          </h2>
        </div>

        <div style={{ padding: "32px 40px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0", textAlign: "center" }}>
            INICIAR SESIÓN
          </h3>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 24px 0", textAlign: "center" }}>
            Ingrese su RUT y contraseña.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", letterSpacing: "0.5px", marginBottom: "6px" }}>
                RUT
              </label>
              <input
                type="text"
                value={rut}
                onChange={handleRutChange}
                placeholder="12345678-9"
                maxLength="10"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: "#eff6ff",
                  color: "#1f2937",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", letterSpacing: "0.5px", marginBottom: "6px" }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: "#eff6ff",
                  color: "#1f2937",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                background: "#ea580c",
                color: "white",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#c2410c")}
              onMouseLeave={(e) => (e.target.style.background = "#ea580c")}
            >
              → INGRESAR AL SISTEMA
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#e5e7eb" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
            <span style={{ padding: "0 10px", fontSize: "10px", color: "#9ca3af", fontWeight: "600" }}>ENTORNO LOCAL</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
          </div>

          <button
            type="button"
            onClick={handleBypass}
            style={{
              width: "100%",
              padding: "10px",
              background: "transparent",
              border: "1px dashed #d1d5db",
              borderRadius: "6px",
              color: "#4b5563",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f9fafb";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            Acceso Rápido (Modo Demo)
          </button>

          <div style={{ marginTop: "24px", textAlign: "center", color: "#9ca3af", fontSize: "11px", letterSpacing: "0.3px" }}>
            Acceso restringido. Solo personal autorizado.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
