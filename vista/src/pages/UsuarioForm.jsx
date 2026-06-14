import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    secretaria: { bg: "#fef3c7", text: "#d97706", base: "#f59e0b" },
  }
};

const MODULES = [
  { id: "obras", label: "Obras", color: "#ef4444" },
  { id: "tareas", label: "Tareas", color: "#3b82f6" },
  { id: "clientes", label: "Clientes", color: "#10b981" },
  { id: "reportes", label: "Reportes", color: "#f59e0b" },
  { id: "usuarios", label: "Usuarios", color: "#8b5cf6" },
];
const ACTIONS = ["ver", "crear", "editar", "eliminar"];

const ROLE_PRESETS = {
  admin:      { obras:{ver:1,crear:1,editar:1,eliminar:1}, tareas:{ver:1,crear:1,editar:1,eliminar:1}, clientes:{ver:1,crear:1,editar:1,eliminar:1}, reportes:{ver:1,crear:1,editar:1,eliminar:1}, usuarios:{ver:1,crear:1,editar:1,eliminar:1} },
  supervisor: { obras:{ver:1,crear:1,editar:1,eliminar:0}, tareas:{ver:1,crear:1,editar:1,eliminar:1}, clientes:{ver:1,crear:1,editar:1,eliminar:0}, reportes:{ver:1,crear:1,editar:0,eliminar:0}, usuarios:{ver:1,crear:0,editar:0,eliminar:0} },
  operario:   { obras:{ver:1,crear:0,editar:1,eliminar:0}, tareas:{ver:1,crear:1,editar:1,eliminar:0}, clientes:{ver:1,crear:0,editar:0,eliminar:0}, reportes:{ver:1,crear:0,editar:0,eliminar:0}, usuarios:{ver:0,crear:0,editar:0,eliminar:0} },
  tecnico:    { obras:{ver:1,crear:0,editar:0,eliminar:0}, tareas:{ver:1,crear:0,editar:1,eliminar:0}, clientes:{ver:0,crear:0,editar:0,eliminar:0}, reportes:{ver:0,crear:0,editar:0,eliminar:0}, usuarios:{ver:0,crear:0,editar:0,eliminar:0} },
  secretaria: { obras:{ver:1,crear:0,editar:0,eliminar:0}, tareas:{ver:1,crear:1,editar:0,eliminar:0}, clientes:{ver:1,crear:1,editar:1,eliminar:0}, reportes:{ver:1,crear:0,editar:0,eliminar:0}, usuarios:{ver:1,crear:0,editar:0,eliminar:0} },
};

const S = {
  page: { padding: "0 0 40px 0", maxWidth: "800px" },
  backLink: { color: C.accent, textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", cursor: "pointer", width: "fit-content" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 },
  subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" },
  panel: { background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" },
  panelBody: { padding: "24px 30px" },
  formSection: { marginBottom: "24px" },
  secTitle: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: "14px", paddingBottom: "8px", borderBottom: `1px solid ${C.border}` },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  formGroup: { marginBottom: "16px" },
  label: { fontSize: "12px", fontWeight: "600", color: C.text, marginBottom: "6px", display: "block" },
  input: { width: "100%", boxSizing: "border-box", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "13px", color: C.text, outline: "none", transition: "border-color 0.15s", background: "#fff" },
  roleCards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  rCard: (active, color) => ({ border: `2px solid ${active ? color : C.border}`, background: active ? `${color}10` : C.surface, borderRadius: "10px", padding: "12px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "12px", transition: "all 0.15s" }),
  rIcon: (bg, text) => ({ width: "32px", height: "32px", borderRadius: "8px", background: bg, color: text, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
  rName: (active, color) => ({ fontSize: "13px", fontWeight: "700", color: active ? color : C.text, margin: 0 }),
  rDesc: { fontSize: "11px", color: C.muted, marginTop: "2px", lineHeight: 1.3 },
  toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" },
  toggleText: { fontSize: "13px", fontWeight: "600", color: C.text },
  toggleSub: { fontSize: "11px", color: C.muted, marginTop: "2px" },
  permTable: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  th: { fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted, padding: "0 8px 12px", textAlign: "center" },
  td: { padding: "12px 8px", borderTop: `1px solid ${C.border}`, textAlign: "center", verticalAlign: "middle" },
  modRow: { display: "flex", alignItems: "center", gap: "8px" },
  modDot: (color) => ({ width: "8px", height: "8px", borderRadius: "50%", background: color }),
  modName: { fontSize: "13px", fontWeight: "600", color: C.text },
  checkbox: { width: "16px", height: "16px", accentColor: C.accent, cursor: "pointer" },
  panelFooter: { padding: "16px 30px", borderTop: `1px solid ${C.border}`, display: "flex", gap: "12px", justifyContent: "flex-end", background: "#f8fafc" },
  btnCancel: { padding: "10px 20px", border: `1px solid ${C.border}`, borderRadius: "8px", background: C.surface, color: C.muted, fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  btnSave: { padding: "10px 24px", border: "none", borderRadius: "8px", background: C.accent, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" }
};

const UsuarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    username: "", 
    email: "", 
    pwd: "", 
    pwd2: "",
    rut_empleado: "",
    rol: "", 
    activo: true,
    permisos: { obras:{}, tareas:{}, clientes:{}, reportes:{}, usuarios:{} }
  });

  // Cargar información del usuario cuando esté en modo edición
  useEffect(() => {
    if (isEditing) {
      const fetchUsuarioIndividual = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/usuarios");
          const data = await res.json();
          if (data.ok) {
            const usuarioCoincidente = data.usuarios.find(u => String(u.id_usuario) === String(id));
            if (usuarioCoincidente) {
              let detectoRol = "operario";
              if (usuarioCoincidente.es_administrador) detectoRol = "admin";
              else if (usuarioCoincidente.es_gerencia || usuarioCoincidente.es_jop) detectoRol = "supervisor";
              else if (usuarioCoincidente.es_tecnico) detectoRol = "tecnico";
              else if (usuarioCoincidente.es_secretaria) detectoRol = "secretaria";

              setForm({
                username: usuarioCoincidente.username || "",
                email: usuarioCoincidente.correo || "",
                pwd: "",
                pwd2: "",
                rut_empleado: usuarioCoincidente.rut_empleado || "",
                rol: detectoRol,
                activo: usuarioCoincidente.estado_cuenta,
                permisos: ROLE_PRESETS[detectoRol] || { obras:{}, tareas:{}, clientes:{}, reportes:{}, usuarios:{} }
              });
            } else {
              alert("Usuario no encontrado.");
              navigate("/dashboard/usuarios");
            }
          }
        } catch (error) {
          console.error("Error al recuperar el usuario:", error);
          alert("No se pudo cargar el usuario.");
        }
      };
      fetchUsuarioIndividual();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rut_empleado") {
      const v = value.replace(/[^\dKk-]/g, '').toUpperCase();
      if (v.length > 1 && !v.includes('-') && v.length <= 9) {
        setForm({ ...form, [name]: v.slice(0, -1) + '-' + v.slice(-1) });
        return;
      }
      setForm({ ...form, [name]: v.substring(0, 10) });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleRoleSelect = (rol) => {
    setForm({ ...form, rol, permisos: JSON.parse(JSON.stringify(ROLE_PRESETS[rol])) });
  };

  const handlePermChange = (mod, act, checked) => {
    setForm(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [mod]: { ...prev.permisos[mod], [act]: checked ? 1 : 0 }
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (form.pwd && form.pwd.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!isEditing && form.pwd !== form.pwd2) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!/^\d{7,8}-[\dkK]$/.test(form.rut_empleado.trim())) {
      alert("El RUT del empleado debe tener formato XXXXXXXX-X (ej: 12345678-9).");
      return;
    }

    const perfilMap = { admin: 1, tecnico: 2, secretaria: 3, gerencia: 4, jop: 5, supervisor: 1, operario: 1 };
    const payload = {
      username: form.username,
      correo: form.email,
      contrasena: form.pwd,
      estado_cuenta: form.activo ?? true,
      es_gerencia: form.rol === "supervisor" || form.rol === "admin",
      es_tecnico: form.rol === "tecnico",
      es_jop: form.rol === "supervisor",
      es_administrador: form.rol === "admin",
      es_secretaria: form.rol === "secretaria",
      id_perfil: perfilMap[form.rol] || 1,
      rut_empleado: form.rut_empleado || null
    };

    try {
      const url = isEditing 
        ? `http://localhost:3000/api/usuarios/${id}` 
        : "http://localhost:3000/api/usuarios";
        
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Leer la respuesta del servidor
      const data = await response.json();

      if (response.ok && data.ok) {
        alert(isEditing ? "Usuario actualizado con éxito" : "Usuario creado con éxito");
        navigate("/dashboard/usuarios");
      } else {
        // Mostrar el mensaje de error estructurado que devuelve el catch del backend
        console.error("Respuesta de error del backend:", data);
        alert(`Error del servidor: ${data.msg || "No se pudo procesar la solicitud"}`);
      }
    } catch (error) {
      console.error("Error crítico de red/comunicación:", error);
      alert("Error de conexión. Asegúrate de que el backend en el puerto 3000 esté corriendo.");
    }
  };

  return (
    <div style={S.page}>
      <div style={S.backLink} onClick={() => navigate("/dashboard/usuarios")}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver a lista de usuarios
      </div>

      <div style={S.header}>
        <h1 style={S.title}>{isEditing ? "Editar usuario" : "Nuevo usuario"}</h1>
        <p style={S.subtitle}>{isEditing ? "Modifica los datos, rol y permisos del usuario." : "Completa el formulario para registrar a alguien en el sistema."}</p>
      </div>

      <form style={S.panel} onSubmit={handleSave}>
        <div style={S.panelBody}>
          
          <div style={S.formSection}>
            <div style={S.secTitle}>Información básica</div>
            <div style={S.grid2}>
              <div style={S.formGroup}>
                <label style={S.label}>Nombre de usuario *</label>
                <input style={S.input} name="username" value={form.username} onChange={handleChange} required placeholder="Ej. j.perez" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>RUT Empleado *</label>
                <input style={S.input} name="rut_empleado" value={form.rut_empleado} onChange={handleChange} required placeholder="Ej. 12345678-9" />
              </div>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Correo electrónico *</label>
              <input style={S.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="correo@empresa.cl" />
            </div>
            <div style={S.grid2}>
              <div style={S.formGroup}>
                <label style={S.label}>Contraseña {isEditing ? "(opcional)" : "*"}</label>
                <input style={S.input} type="password" name="pwd" value={form.pwd} onChange={handleChange} required={!isEditing} placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Mín. 6 caracteres"} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Repetir contraseña {isEditing && !form.pwd ? "" : "*"}</label>
                <input style={S.input} type="password" name="pwd2" value={form.pwd2} onChange={handleChange} required={!isEditing || form.pwd.length > 0} placeholder="Confirmar" disabled={isEditing && !form.pwd} />
              </div>
            </div>
          </div>

          <div style={S.formSection}>
            <div style={S.secTitle}>Rol del usuario</div>
            <div style={S.roleCards}>
              {[
                { id: "admin", name: "Administrador", desc: "Acceso total al sistema" },
                { id: "supervisor", name: "Supervisor", desc: "Gestión de obras y equipo" },
                { id: "operario", name: "Operario", desc: "Ejecución de tareas en obra" },
                { id: "tecnico", name: "Técnico", desc: "Instalación y mantención" },
                { id: "secretaria", name: "Secretaria", desc: "Administración y documentos" }
              ].map(r => {
                const active = form.rol === r.id;
                const colors = C.roles[r.id];
                return (
                  <div key={r.id} style={S.rCard(active, colors.base)} onClick={() => handleRoleSelect(r.id)}>
                    <div style={S.rIcon(colors.bg, colors.text)}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div>
                      <h4 style={S.rName(active, colors.base)}>{r.name}</h4>
                      <div style={S.rDesc}>{r.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={S.formSection}>
            <div style={S.secTitle}>Estado</div>
            <div style={S.toggleRow}>
              <div>
                <div style={S.toggleText}>Usuario activo</div>
                <div style={S.toggleSub}>El usuario puede iniciar sesión en el sistema</div>
              </div>
              <input 
                type="checkbox" 
                checked={form.activo} 
                onChange={(e) => setForm({...form, activo: e.target.checked})} 
                style={{ width: "20px", height: "20px", accentColor: C.accent, cursor: "pointer" }} 
              />
            </div>
          </div>

          {form.rol && (
            <div style={{...S.formSection, marginBottom: 0}}>
              <div style={S.secTitle}>Permisos detallados</div>
              <table style={S.permTable}>
                <thead>
                  <tr>
                    <th style={{...S.th, textAlign: "left", paddingLeft: 0}}>Módulo</th>
                    {ACTIONS.map(a => <th key={a} style={S.th}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map(m => (
                    <tr key={m.id}>
                      <td style={{...S.td, textAlign: "left", paddingLeft: 0}}>
                        <div style={S.modRow}>
                          <span style={S.modDot(m.color)}></span>
                          <span style={S.modName}>{m.label}</span>
                        </div>
                      </td>
                      {ACTIONS.map(a => (
                        <td key={a} style={S.td}>
                          <input 
                            type="checkbox" 
                            style={S.checkbox}
                            checked={!!form.permisos[m.id]?.[a]}
                            onChange={(e) => handlePermChange(m.id, a, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
        <div style={S.panelFooter}>
          <button type="button" style={S.btnCancel} onClick={() => navigate("/dashboard/usuarios")}>Cancelar</button>
          <button type="submit" style={S.btnSave} onMouseEnter={e => e.currentTarget.style.background = C.accentHov} onMouseLeave={e => e.currentTarget.style.background = C.accent}>
            {isEditing ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;