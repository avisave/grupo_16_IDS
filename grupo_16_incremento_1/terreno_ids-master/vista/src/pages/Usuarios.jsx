import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Design tokens ────────────────────────────────────────────────── */
const C = {
  bg:        "#f4f6f9",
  surface:   "#ffffff",
  border:    "#e2e8f0",
  accent:    "#eb6425",
  accentHov: "#d0551c",
  danger:    "#ef4444",
  text:      "#0f172a",
  muted:     "#64748b",
  roles: {
    admin:      { bg: "#fee2e2", text: "#dc2626", base: "#ef4444" },
    supervisor: { bg: "#dbeafe", text: "#2563eb", base: "#3b82f6" },
    operario:   { bg: "#d1fae5", text: "#16a34a", base: "#10b981" },
    tecnico:    { bg: "#ede9fe", text: "#7c3aed", base: "#8b5cf6" },
  },
  status: {
    on:  { bg: "#dcfce7", text: "#16a34a" },
    off: { bg: "#f1f5f9", text: "#94a3b8" }
  }
};

const S = {
  page: { padding: "0 0 40px 0" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 },
  subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" },
  btnNew: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: (color) => ({ background: C.surface, borderRadius: "10px", border: `1px solid ${C.border}`, padding: "18px", position: "relative", overflow: "hidden", borderTop: `4px solid ${color}` }),
  statLabel: { fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: "8px" },
  statNum: (color) => ({ fontSize: "28px", fontWeight: "800", lineHeight: 1, margin: "0 0 4px 0", color: color }),
  statDesc: { fontSize: "11px", color: C.muted },
  panel: { background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" },
  panelHeader: { padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { fontSize: "15px", fontWeight: "700", color: C.text, margin: 0 },
  badgeCount: { background: C.accent, color: "#fff", fontSize: "11px", fontWeight: "700", borderRadius: "12px", padding: "3px 9px" },
  panelBody: { padding: "16px 20px" },
  searchRow: { display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 12px", marginBottom: "14px" },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: "13px", color: C.text, width: "100%" },
  filterPills: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" },
  pill: (active) => ({ fontSize: "11px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", border: `1.5px solid ${active ? C.accent : C.border}`, background: active ? C.accent : C.surface, color: active ? "#fff" : C.muted, transition: "all 0.15s" }),
  uItem: { display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: `1px solid #f1f5f9`, transition: "background 0.1s" },
  uAv: (color) => ({ width: "36px", height: "36px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff", flexShrink: 0 }),
  uInfo: { flex: 1, minWidth: 0 },
  uName: { fontSize: "14px", fontWeight: "600", color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  uUser: { fontSize: "12px", color: C.muted, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  uBadges: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
  badge: (colors) => ({ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px", background: colors.bg, color: colors.text }),
  uActs: { display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, marginLeft: "10px" },
  iBtn: { width: "30px", height: "30px", borderRadius: "6px", border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", color: C.muted },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, backdropFilter: "blur(2px)" },
  modal: { background: C.surface, borderRadius: "14px", width: "360px", padding: "28px 30px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
  modalTitle: { fontSize: "17px", fontWeight: "700", color: C.text, margin: "0 0 10px" },
  modalDesc: { fontSize: "13px", color: C.muted, marginBottom: "24px", lineHeight: 1.5 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  btnCancel: { padding: "8px 18px", border: `1px solid ${C.border}`, borderRadius: "7px", background: "transparent", color: C.muted, fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  btnDanger: { padding: "8px 18px", border: "none", borderRadius: "7px", background: C.danger, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }
};

const Usuarios = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Guardamos los usuarios mapeados desde PostgreSQL
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = { admin: "Administrador", supervisor: "Supervisor", operario: "Operario", tecnico: "Técnico" };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/usuarios");
      const data = await res.json();
      
      if (data.ok) {
        const mapeados = data.usuarios.map(u => {
          let rolAsignado = "operario";
          if (u.es_administrador) rolAsignado = "admin";
          else if (u.es_gerencia || u.es_jop) rolAsignado = "supervisor";
          else if (u.es_tecnico) rolAsignado = "tecnico";

          return {
            id: u.id_usuario,
            nombre: u.username, 
            username: u.username,
            email: u.correo,
            rol: rolAsignado,
            activo: u.estado_cuenta,
            rut: u.rut_empleado
          };
        });
        setUsers(mapeados);
      }
    } catch (error) {
      console.error("Error al cargar usuarios desde Express:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchFilter = filter === "todos" || u.rol === filter;
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${deleteTarget.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.ok) {
        setUsers(users.filter(u => u.id !== deleteTarget.id));
      } else {
        alert(`Error al eliminar: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: C.muted, fontSize: "14px" }}>Conectando con base de datos PostgreSQL...</div>;
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Usuarios internos</h1>
          <p style={S.subtitle}>Crea y administra los usuarios del sistema con sus roles y permisos.</p>
        </div>
        <button 
          style={S.btnNew} 
          onMouseEnter={e => e.currentTarget.style.background = C.accentHov}
          onMouseLeave={e => e.currentTarget.style.background = C.accent}
          onClick={() => navigate("/dashboard/usuarios/nuevo")}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo usuario
        </button>
      </div>

      {/* Stats Dinámicos */}
      <div style={S.statsRow}>
        <div style={S.statCard(C.roles.supervisor.base)}>
          <div style={S.statLabel}>Total usuarios</div>
          <div style={S.statNum(C.roles.supervisor.base)}>{users.length}</div>
          <div style={S.statDesc}>Registrados en PostgreSQL</div>
        </div>
        <div style={S.statCard(C.roles.operario.base)}>
          <div style={S.statLabel}>Activos</div>
          <div style={S.statNum(C.roles.operario.base)}>{users.filter(u => u.activo).length}</div>
          <div style={S.statDesc}>Cuentas habilitadas</div>
        </div>
        <div style={S.statCard(C.accent)}>
          <div style={S.statLabel}>Administradores</div>
          <div style={S.statNum(C.accent)}>{users.filter(u => u.rol === "admin").length}</div>
          <div style={S.statDesc}>Acceso total</div>
        </div>
        <div style={S.statCard(C.roles.tecnico.base)}>
          <div style={S.statLabel}>Inactivos</div>
          <div style={S.statNum(C.roles.tecnico.base)}>{users.filter(u => !u.activo).length}</div>
          <div style={S.statDesc}>Acceso restringido</div>
        </div>
      </div>

      <div style={S.panel}>
        <div style={S.panelHeader}>
          <h3 style={S.panelTitle}>Usuarios del sistema</h3>
          <span style={S.badgeCount}>{filteredUsers.length}</span>
        </div>
        
        <div style={S.panelBody}>
          <div style={S.searchRow}>
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              style={S.searchInput} 
              type="text" 
              placeholder="Buscar por usuario o correo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={S.filterPills}>
            {["todos", "admin", "supervisor", "operario", "tecnico"].map(f => (
              <div 
                key={f}
                style={S.pill(filter === f)} 
                onClick={() => setFilter(f)}
              >
                {f === "todos" ? "Todos" : labels[f]}
              </div>
            ))}
          </div>
        </div>

        <div>
          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: C.muted, fontSize: "14px" }}>No se encontraron usuarios.</div>
          ) : (
            filteredUsers.map(u => {
              const initials = u.username ? u.username.substring(0,2).toUpperCase() : "US";
              return (
                <div key={u.id} style={S.uItem} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={S.uAv(C.roles[u.rol]?.base || C.muted)}>{initials}</div>
                  <div style={S.uInfo}>
                    <div style={S.uName}>{u.username}</div>
                    <div style={S.uUser}>{u.email} {u.rut ? `· RUT: ${u.rut}` : ''}</div>
                  </div>
                  <div style={S.uBadges}>
                    <span style={S.badge(C.roles[u.rol] || C.roles.operario)}>{labels[u.rol]}</span>
                    <span style={S.badge(u.activo ? C.status.on : C.status.off)}>{u.activo ? "Activo" : "Inactivo"}</span>
                  </div>
                  <div style={S.uActs}>
                    <button 
                      style={S.iBtn} title="Editar usuario"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                      onClick={() => navigate(`/dashboard/usuarios/editar/${u.id}`)}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button 
                      style={S.iBtn} title="Eliminar usuario"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.danger; e.currentTarget.style.color = C.danger; e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = C.surface; }}
                      onClick={() => setDeleteTarget(u)}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Eliminación */}
      {deleteTarget && (
        <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div style={S.modal}>
            <h3 style={S.modalTitle}>¿Eliminar usuario?</h3>
            <p style={S.modalDesc}>¿Estás seguro de eliminar a <strong>{deleteTarget.nombre}</strong>? Esta acción no se puede deshacer.</p>
            <div style={S.modalFooter}>
              <button style={S.btnCancel} onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button style={S.btnDanger} onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;