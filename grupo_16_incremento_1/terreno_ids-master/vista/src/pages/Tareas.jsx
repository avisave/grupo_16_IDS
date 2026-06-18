import { useState, useEffect, useContext } from "react";
import { TareasContext } from "../context/TareasContext";

/* ─── Design tokens (Se mantienen iguales) ────────────────────────── */
const C = { bg: "#f4f6f9", surface: "#ffffff", border: "#e2e8f0", accent: "#eb6425", accentHov: "#d0551c", danger: "#ef4444", text: "#0f172a", muted: "#64748b", status: { pendiente: { bg: "#eff6ff", text: "#2563eb" }, en_progreso: { bg: "#fef3c7", text: "#d97706" }, completada: { bg: "#f0fdf4", text: "#16a34a" }, cancelada: { bg: "#fef2f2", text: "#dc2626" } }, urgency: { urgente: { bg: "#fee2e2", text: "#dc2626", border: "#dc2626" }, alta: { bg: "#fff1e6", text: "#ea6c0a", border: "#ea6c0a" }, media: { bg: "#fef3c7", text: "#d97706", border: "#d97706" }, baja: { bg: "#f0fdf4", text: "#16a34a", border: "#16a34a" } } };
const S = {
  page: { padding: "0 0 40px 0" }, header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }, title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 }, subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" }, btnPrimary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s", whiteSpace: "nowrap" }, btnSecondary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" }, filters: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }, filterInputWrap: { display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", flex: 1, minWidth: "200px", maxWidth: "320px" }, filterInput: { border: "none", background: "transparent", outline: "none", fontSize: "12px", color: C.text, width: "100%" }, filterSelect: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", fontSize: "12px", color: C.text, outline: "none", cursor: "pointer" }, tableCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }, table: { width: "100%", borderCollapse: "collapse" }, th: { padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted, borderBottom: `1px solid ${C.border}`, background: "#f8fafc", whiteSpace: "nowrap" }, td: { padding: "12px 16px", fontSize: "12px", color: C.text, borderBottom: `1px solid #f1f5f9` }, tdName: { fontWeight: "600" }, badge: (colors) => ({ display: "inline-flex", alignItems: "center", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "10px", whiteSpace: "nowrap", background: colors.bg, color: colors.text, textTransform: "capitalize" }), techChips: { display: "flex", flexWrap: "wrap", gap: "4px" }, techChip: { display: "inline-flex", alignItems: "center", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "3px 8px", fontSize: "10px", fontWeight: "500", color: C.muted }, actionBtn: { display: "flex", alignItems: "center", gap: "5px", padding: "6px 10px", borderRadius: "6px", border: `1px solid ${C.border}`, background: C.surface, fontSize: "11px", fontWeight: "600", color: C.muted, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }, overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }, modal: { background: C.surface, borderRadius: "12px", width: "540px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }, modalHeader: { padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }, modalTitle: { fontSize: "16px", fontWeight: "700", color: C.text, margin: 0 }, modalClose: { background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }, modalBody: { padding: "20px" }, modalFooter: { padding: "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: "8px", background: "#f8fafc" }, sidePanel: { position: "fixed", top: 0, right: 0, bottom: 0, width: "460px", background: C.surface, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column" }, panelBody: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }, secTitle: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: "12px", paddingBottom: "6px", borderBottom: `1px solid #f1f5f9` }, descBox: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: C.text, lineHeight: 1.6 }, readCard: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }, rcLabel: { fontSize: "10px", color: C.muted, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }, rcValue: { fontSize: "13px", color: C.text, fontWeight: "500" }, grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }, formGroup: { display: "flex", flexDirection: "column", gap: "6px" }, label: { fontSize: "12px", fontWeight: "600", color: C.text }, input: { border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: C.text, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" }, urgSelector: { display: "flex", gap: "8px", flexWrap: "wrap" }, urgBtn: (active, color) => ({ padding: "8px 16px", borderRadius: "8px", border: `2px solid ${active ? color.border : C.border}`, fontSize: "12px", fontWeight: "600", cursor: "pointer", background: active ? color.bg : C.surface, color: active ? color.border : C.muted, transition: "all 0.15s" }), techRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 12px", marginBottom: "6px" }, assignRow: { display: "flex", gap: "8px", marginTop: "12px" },
  // Timeline extra styles para el panel de Tareas
  tItem: { position: "relative", paddingLeft: "16px", fontSize: "11px", color: C.muted, marginBottom: "8px" },
  tDot: { position: "absolute", left: 0, top: "4px", width: "6px", height: "6px", background: C.border, borderRadius: "50%" },
  tLine: { position: "absolute", left: "2.5px", top: "10px", bottom: "-8px", width: "1px", background: C.border }
};

const Tareas = () => {
  const { tareas, loading, actualizarTarea, crearTarea } = useContext(TareasContext);

  const [search, setSearch] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [fUrgencia, setFUrgencia] = useState("");
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTask, setNewTask] = useState({ titulo: "", descripcion: "", estado: "pendiente", urgencia: "media", visita: "", termino: "", tecnicos: [] });

  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserIdEdit, setSelectedUserIdEdit] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [urgTemp, setUrgTemp] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/usuarios")
      .then(r => r.json())
      .then(data => { if (data.ok) setUsuarios(data.usuarios); })
      .catch(() => {});
  }, []);

  const getNombreTecnico = (id) => {
    const u = usuarios.find(x => x.id_usuario === id);
    if (!u) return `Técnico #${id}`;
    return [u.primer_nombre, u.primer_apellido].filter(Boolean).join(" ") || u.username || `#${id}`;
  };

  const filteredTasks = tareas.filter(t => {
    const matchText = t.titulo.toLowerCase().includes(search.toLowerCase()) || t.tecnicos.some(u => String(u).includes(search));
    const matchEst = !fEstado || t.estado === fEstado;
    const matchUrg = !fUrgencia || t.urgencia === fUrgencia;
    return matchText && matchEst && matchUrg;
  });

  const handleOpenPanel = (task) => {
    setSelectedTask({ ...task });
    setUrgTemp(task.urgencia);
  };

  const handleSavePanel = () => {
    // Generar el string de auditoría automático
    let accion = "Actualización de atributos de tarea";
    const tareaOriginal = tareas.find(t => t.id === selectedTask.id);
    if (tareaOriginal.estado !== selectedTask.estado) {
      accion = `Cambió estado de [${tareaOriginal.estado.replace('_',' ')}] a [${selectedTask.estado.replace('_',' ')}]`;
    } else if (tareaOriginal.urgencia !== urgTemp) {
      accion = `Modificó urgencia a [${urgTemp}]`;
    }

    const camposActualizados = {
      ...selectedTask,
      urgencia: urgTemp
    };

    // Llamamos al contexto para actualizar y generar la trazabilidad automáticamente
    actualizarTarea(selectedTask.id, camposActualizados, accion, "Modificado desde el panel de Tareas.");
    setSelectedTask(null);
  };

  const handleRemoveTech = (tid) => {
    setSelectedTask({ ...selectedTask, tecnicos: selectedTask.tecnicos.filter(u => u !== tid) });
  };

  const handleCreateTask = async () => {
    if (!newTask.titulo.trim()) return alert("El título es obligatorio");
    await crearTarea(newTask);
    setShowNewModal(false);
    setNewTask({ titulo: "", descripcion: "", estado: "pendiente", urgencia: "media", visita: "", termino: "", tecnicos: [] });
    setSelectedUserId("");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Gestión de Tareas</h1>
          <p style={S.subtitle}>Asignación de técnicos, creación y niveles de urgencia</p>
        </div>
        <button style={S.btnPrimary} onClick={() => setShowNewModal(true)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Tarea
        </button>
      </div>

      <div style={S.filters}>
        <div style={S.filterInputWrap}>
          <svg width="14" height="14" fill="none" stroke={C.muted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={S.filterInput} placeholder="Buscar por título o nombre de técnico..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.filterSelect} value={fEstado} onChange={e => setFEstado(e.target.value)}><option value="">Todos los estados</option><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option></select>
        <select style={S.filterSelect} value={fUrgencia} onChange={e => setFUrgencia(e.target.value)}><option value="">Toda urgencia</option><option value="urgente">Urgente</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select>
      </div>

      {loading ? (
        <div style={{textAlign: "center", padding: "40px", color: C.muted, fontSize: "14px"}}>Cargando tareas...</div>
      ) : tareas.length === 0 ? (
        <div style={{textAlign: "center", padding: "40px", color: C.muted, fontSize: "14px"}}>No hay tareas registradas</div>
      ) : (
      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr><th style={S.th}>ID</th><th style={S.th}>Título</th><th style={S.th}>Estado</th><th style={S.th}>Urgencia</th><th style={S.th}>Fecha visita</th><th style={S.th}>Técnicos</th><th style={S.th}>Acciones</th></tr>
          </thead>
          <tbody>
            {filteredTasks.map(t => (
              <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{...S.td, ...S.tdName, color: C.muted}}>#{t.id}</td>
                <td style={{...S.td, ...S.tdName}}>{t.titulo}</td>
                <td style={S.td}><span style={S.badge(C.status[t.estado])}>{t.estado.replace('_', ' ')}</span></td>
                <td style={S.td}><span style={S.badge(C.urgency[t.urgencia])}>{t.urgencia}</span></td>
                <td style={{...S.td, color: C.muted}}>{t.visita}</td>
                <td style={S.td}><div style={S.techChips}>{t.tecnicos.length === 0 ? <span style={{fontSize: "11px", color: "#cbd5e1"}}>Sin asignar</span> : t.tecnicos.map(u => <span key={u} style={S.techChip}>{getNombreTecnico(u)}</span>)}</div></td>
                <td style={S.td}>
                  <button style={S.actionBtn} onClick={() => handleOpenPanel(t)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Ver / Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {showNewModal && (
        <>
          <div style={S.overlay} onClick={() => { setShowNewModal(false); setNewTask({ titulo: "", descripcion: "", estado: "pendiente", urgencia: "media", visita: "", termino: "", tecnicos: [] }); setSelectedUserId(""); }}></div>
          <div style={S.sidePanel}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>Nueva Tarea</h3>
                <div style={{fontSize: "11px", color: C.muted, marginTop: "2px"}}>Crear una nueva tarea en el sistema</div>
              </div>
              <button style={S.modalClose} onClick={() => { setShowNewModal(false); setNewTask({ titulo: "", descripcion: "", estado: "pendiente", urgencia: "media", visita: "", termino: "", tecnicos: [] }); setSelectedUserId(""); }}>✕</button>
            </div>
            <div style={S.panelBody}>
              <div>
                <div style={S.secTitle}>Información de la Tarea</div>
                <div style={S.formGroup}>
                  <label style={S.label}>Título *</label>
                  <input style={S.input} type="text" placeholder="Ej: Instalación puerta piso 3" value={newTask.titulo} onChange={e => setNewTask({...newTask, titulo: e.target.value})} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Descripción</label>
                  <textarea style={{...S.input, minHeight: "70px", resize: "vertical"}} placeholder="Detalles de la tarea..." value={newTask.descripcion} onChange={e => setNewTask({...newTask, descripcion: e.target.value})} />
                </div>
              </div>
              <div>
                <div style={S.secTitle}>Configuración</div>
                <div style={S.grid2}>
                  <div style={S.formGroup}>
                    <label style={S.label}>Estado</label>
                    <select style={S.input} value={newTask.estado} onChange={e => setNewTask({...newTask, estado: e.target.value})}>
                      <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Urgencia</label>
                    <select style={S.input} value={newTask.urgencia} onChange={e => setNewTask({...newTask, urgencia: e.target.value})}>
                      <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option><option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Fecha visita</label>
                    <input style={S.input} type="date" value={newTask.visita} onChange={e => setNewTask({...newTask, visita: e.target.value})} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Fecha término</label>
                    <input style={S.input} type="date" value={newTask.termino} onChange={e => setNewTask({...newTask, termino: e.target.value})} />
                  </div>
                </div>
              </div>
              <div>
                <div style={S.secTitle}>Técnicos Asignados</div>
                <div>
                  {newTask.tecnicos.map(uid => (
                    <div key={uid} style={S.techRow}><span style={{fontSize: "13px", fontWeight: "500", color: C.text}}>{getNombreTecnico(uid)}</span><button style={{...S.modalClose, color: C.danger}} onClick={() => setNewTask({...newTask, tecnicos: newTask.tecnicos.filter(u => u !== uid)})}>✕</button></div>
                  ))}
                </div>
                <div style={S.assignRow}>
                  <select style={{...S.input, flex: 1}} value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                    <option value="">Seleccionar técnico...</option>
                    {usuarios.filter(u => !newTask.tecnicos.includes(u.id_usuario)).map(u => (
                      <option key={u.id_usuario} value={u.id_usuario}>{getNombreTecnico(u.id_usuario)}</option>
                    ))}
                  </select>
                  <button style={S.btnSecondary} onClick={() => {
                    if (!selectedUserId) return alert("Selecciona un técnico");
                    setNewTask({...newTask, tecnicos: [...newTask.tecnicos, parseInt(selectedUserId)]});
                    setSelectedUserId("");
                  }}>Agregar</button>
                </div>
              </div>
            </div>
            <div style={S.modalFooter}>
              <button style={S.btnSecondary} onClick={() => { setShowNewModal(false); setNewTask({ titulo: "", descripcion: "", estado: "pendiente", urgencia: "media", visita: "", termino: "", tecnicos: [] }); setSelectedUserId(""); }}>Cancelar</button>
              <button style={S.btnPrimary} onClick={handleCreateTask}>Crear Tarea</button>
            </div>
          </div>
        </>
      )}

      {selectedTask && (
        <>
          <div style={S.overlay} onClick={() => setSelectedTask(null)}></div>
          <div style={S.sidePanel}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>{selectedTask.titulo}</h3>
                <div style={{fontSize: "11px", color: C.muted, marginTop: "2px"}}>{selectedTask.codigo} · ID #{selectedTask.id}</div>
              </div>
              <button style={S.modalClose} onClick={() => setSelectedTask(null)}>✕</button>
            </div>
            
            <div style={S.panelBody}>
              <div><div style={S.secTitle}>Descripción</div><div style={S.descBox}>{selectedTask.descripcion}</div></div>

              <div>
                <div style={S.secTitle}>Configuración y Estado</div>
                <div style={S.grid2}>
                  <div style={S.formGroup}>
                    <label style={S.label}>Estado</label>
                    <select style={S.input} value={selectedTask.estado} onChange={e => setSelectedTask({...selectedTask, estado: e.target.value})}>
                      <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Fecha visita</label>
                    <input style={S.input} type="date" value={selectedTask.visita !== "—" ? selectedTask.visita : ""} onChange={e => setSelectedTask({...selectedTask, visita: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <div style={S.secTitle}>Urgencia</div>
                <div style={S.urgSelector}>
                  {["baja", "media", "alta", "urgente"].map(u => (
                    <button key={u} style={S.urgBtn(urgTemp === u, C.urgency[u])} onClick={() => setUrgTemp(u)}>{u.charAt(0).toUpperCase() + u.slice(1)}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={S.secTitle}>Técnicos Asignados</div>
                <div>
                  {selectedTask.tecnicos.map(uid => (
                    <div key={uid} style={S.techRow}><span style={{fontSize: "13px", fontWeight: "500", color: C.text}}>{getNombreTecnico(uid)}</span><button style={{...S.modalClose, color: C.danger}} onClick={() => handleRemoveTech(uid)}>✕</button></div>
                  ))}
                </div>
                <div style={S.assignRow}>
                  <select style={{...S.input, flex: 1}} value={selectedUserIdEdit} onChange={e => setSelectedUserIdEdit(e.target.value)}>
                    <option value="">Seleccionar técnico...</option>
                    {usuarios.filter(u => !selectedTask.tecnicos.includes(u.id_usuario)).map(u => (
                      <option key={u.id_usuario} value={u.id_usuario}>{getNombreTecnico(u.id_usuario)}</option>
                    ))}
                  </select>
                  <button style={S.btnSecondary} onClick={() => {
                    if (!selectedUserIdEdit) return alert("Selecciona un técnico");
                    if (selectedTask.tecnicos.includes(parseInt(selectedUserIdEdit))) return alert("Ya está asignado");
                    setSelectedTask({ ...selectedTask, tecnicos: [...selectedTask.tecnicos, parseInt(selectedUserIdEdit)] });
                    setSelectedUserIdEdit("");
                  }}>Agregar</button>
                </div>
              </div>

              {/* Historial rápido incrustado para ver la conexión de los datos */}
              <div>
                <div style={S.secTitle}>Historial Reciente (Trazabilidad)</div>
                <div>
                  {selectedTask.historial.slice(0, 2).map((h, i) => (
                    <div key={i} style={S.tItem}>
                      <div style={S.tDot}></div>
                      {i === 0 && selectedTask.historial.length > 1 && <div style={S.tLine}></div>}
                      <span style={{color: C.text, fontWeight: "600"}}>{h.accion}</span> · {h.fecha}
                    </div>
                  ))}
                  {selectedTask.historial.length > 2 && <div style={{fontSize: "10px", color: C.accent, paddingLeft: "16px", cursor: "pointer"}}>Ver bitácora completa en módulo Trazabilidad...</div>}
                </div>
              </div>

            </div>
            <div style={S.modalFooter}>
              <button style={S.btnSecondary} onClick={() => setSelectedTask(null)}>Cancelar</button>
              <button style={S.btnPrimary} onClick={handleSavePanel}>Guardar cambios</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tareas;