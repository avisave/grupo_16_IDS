import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const C = { bg: "#f4f6f9", surface: "#ffffff", border: "#e2e8f0", accent: "#eb6425", text: "#0f172a", muted: "#64748b", success: "#16a34a", danger: "#ef4444" };

const S = {
  page: { padding: "0 0 40px 0" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 },
  subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted, borderBottom: `1px solid ${C.border}`, background: "#f8fafc" },
  td: { padding: "12px 16px", fontSize: "12px", color: C.text, borderBottom: `1px solid #f1f5f9` },
  badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "10px", background: bg, color }),
  btnApprove: { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer", marginRight: "6px" },
  btnReject: { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#ef4444", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer" },
  empty: { textAlign: "center", padding: "40px", color: C.muted, fontSize: "14px" }
};

const Solicitudes = () => {
  const { user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [rechazo, setRechazo] = useState({ id: null, motivo: "" });

  const fetchSolicitudes = async () => {
    const res = await fetch("http://localhost:3000/api/solicitudes?estado=pendiente", {
      headers: { "x-user-id": user?.id }
    });
    const data = await res.json();
    if (data.ok) setSolicitudes(data.solicitudes);
  };

  useEffect(() => { if (user) fetchSolicitudes(); }, [user]);

  const handleAprobar = async (id) => {
    await fetch(`http://localhost:3000/api/solicitudes/${id}/aprobar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": user?.id },
      body: JSON.stringify({ id_usuario_revisor: parseInt(user.id) })
    });
    fetchSolicitudes();
  };

  const handleRechazar = async (id) => {
    if (!rechazo.motivo.trim()) return alert("Debes ingresar un motivo");
    await fetch(`http://localhost:3000/api/solicitudes/${id}/rechazar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": user?.id },
      body: JSON.stringify({ id_usuario_revisor: parseInt(user.id), motivo: rechazo.motivo })
    });
    setRechazo({ id: null, motivo: "" });
    fetchSolicitudes();
  };

  const accionLabel = (accion) => {
    const map = { crear_tarea: "Crear tarea", editar_tarea: "Editar tarea", eliminar_tarea: "Eliminar tarea" };
    return map[accion] || accion;
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Solicitudes de Permiso</h1>
          <p style={S.subtitle}>Aprobar o rechazar solicitudes de operarios</p>
        </div>
      </div>

      <div style={S.card}>
        {solicitudes.length === 0 ? (
          <div style={S.empty}>No hay solicitudes pendientes</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>ID</th>
                <th style={S.th}>Solicitante</th>
                <th style={S.th}>Acción</th>
                <th style={S.th}>Fecha</th>
                <th style={S.th}>Estado</th>
                <th style={S.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id_solicitud}>
                  <td style={S.td}>#{s.id_solicitud}</td>
                  <td style={S.td}>{s.solicitante_username || `#${s.id_usuario_solicitante}`}</td>
                  <td style={S.td}>{accionLabel(s.accion)}</td>
                  <td style={S.td}>{new Date(s.fecha_creacion).toLocaleString()}</td>
                  <td style={S.td}><span style={S.badge("#fef3c7", "#d97706")}>Pendiente</span></td>
                  <td style={S.td}>
                    <button style={S.btnApprove} onClick={() => handleAprobar(s.id_solicitud)}>Aprobar</button>
                    {rechazo.id === s.id_solicitud ? (
                      <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                        <input style={{ flex: 1, padding: "4px 8px", fontSize: "11px", borderRadius: "4px", border: `1px solid ${C.border}` }} placeholder="Motivo" value={rechazo.motivo} onChange={e => setRechazo({ ...rechazo, motivo: e.target.value })} />
                        <button style={S.btnReject} onClick={() => handleRechazar(s.id_solicitud)}>Confirmar</button>
                        <button style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px", border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer" }} onClick={() => setRechazo({ id: null, motivo: "" })}>X</button>
                      </div>
                    ) : (
                      <button style={S.btnReject} onClick={() => setRechazo({ id: s.id_solicitud, motivo: "" })}>Rechazar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Solicitudes;
