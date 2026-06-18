import { useState, useContext } from "react";
import { TareasContext } from "../context/TareasContext";

/* ─── Design tokens (Iguales) ─────────────────────────────────────── */
const C = { bg: "#f4f6f9", surface: "#ffffff", border: "#e2e8f0", accent: "#eb6425", accentHov: "#d0551c", danger: "#ef4444", text: "#0f172a", muted: "#64748b", status: { pendiente: { bg: "#eff6ff", text: "#2563eb" }, en_progreso: { bg: "#fef3c7", text: "#d97706" }, completada: { bg: "#f0fdf4", text: "#16a34a" }, cancelada: { bg: "#fef2f2", text: "#dc2626" } } };
const S = { page: { padding: "0 0 40px 0" }, header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }, title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 }, subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" }, btnPrimary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }, btnSecondary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }, filters: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }, filterInputWrap: { display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", flex: 1, minWidth: "200px", maxWidth: "320px" }, filterInput: { border: "none", background: "transparent", outline: "none", fontSize: "12px", color: C.text, width: "100%" }, filterSelect: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", fontSize: "12px", color: C.text, outline: "none", cursor: "pointer" }, tableCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }, table: { width: "100%", borderCollapse: "collapse" }, th: { padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted, borderBottom: `1px solid ${C.border}`, background: "#f8fafc", whiteSpace: "nowrap" }, td: { padding: "12px 16px", fontSize: "12px", color: C.text, borderBottom: `1px solid #f1f5f9`, verticalAlign: "middle" }, tdName: { fontWeight: "600", color: C.text }, tdSub: { fontSize: "11px", color: C.muted, marginTop: "2px" }, badge: (colors) => ({ display: "inline-flex", alignItems: "center", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "10px", whiteSpace: "nowrap", background: colors.bg, color: colors.text, textTransform: "capitalize" }), actionBtn: { display: "flex", alignItems: "center", gap: "5px", padding: "6px 10px", borderRadius: "6px", border: `1px solid ${C.border}`, background: C.surface, fontSize: "11px", fontWeight: "600", color: C.muted, cursor: "pointer" }, overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 999, backdropFilter: "blur(2px)" }, sidePanel: { position: "fixed", top: 0, right: 0, bottom: 0, width: "480px", background: C.surface, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column" }, modalHeader: { padding: "20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }, modalTitle: { fontSize: "16px", fontWeight: "700", color: C.text, margin: 0, lineHeight: 1.3 }, modalClose: { background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: "4px" }, panelBody: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }, modalFooter: { padding: "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: "8px", background: "#f8fafc" }, secTitle: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: "14px", paddingBottom: "6px", borderBottom: `1px solid #f1f5f9` }, formGroup: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }, label: { fontSize: "12px", fontWeight: "600", color: C.text }, input: { border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: C.text, outline: "none", width: "100%", boxSizing: "border-box", background: C.surface }, timeline: { display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "8px" }, timelineItem: { position: "relative", paddingLeft: "24px", fontSize: "13px", color: C.text }, timelineDot: { position: "absolute", left: "0", top: "4px", width: "10px", height: "10px", background: C.accent, borderRadius: "50%", zIndex: 2 }, timelineLine: { position: "absolute", left: "4.5px", top: "14px", bottom: "-20px", width: "2px", background: C.border, zIndex: 1 }, tMeta: { fontSize: "11px", color: C.muted, marginBottom: "4px", display: "flex", justifyContent: "space-between" }, tUser: { fontWeight: "700", color: C.text }, tDesc: { lineHeight: 1.5 }, tNote: { marginTop: "6px", padding: "8px 12px", background: "#f8fafc", borderLeft: `3px solid ${C.border}`, borderRadius: "0 6px 6px 0", fontStyle: "italic", color: C.muted, fontSize: "12px" } };

const Trazabilidad = () => {
  const { tareas, actualizarTarea } = useContext(TareasContext); // <-- Consumimos el contexto

  const [search, setSearch] = useState("");
  const [fEstado, setFEstado] = useState("");
  
  // Panel state
  const [selectedItem, setSelectedItem] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [motivo, setMotivo] = useState("");

  const filteredItems = tareas.filter(i => {
    const matchText = i.titulo.toLowerCase().includes(search.toLowerCase()) || i.codigo.toLowerCase().includes(search.toLowerCase());
    const matchEst = !fEstado || i.estado === fEstado;
    return matchText && matchEst;
  });

  const handleOpenPanel = (item) => {
    setSelectedItem({ ...item });
    setNuevoEstado(item.estado);
    setMotivo("");
  };

  const handleRegistrar = () => {
    if (!motivo.trim()) return alert("Por favor, ingresa el motivo o nota del cambio.");
    
    let accionDetalle = selectedItem.estado === nuevoEstado 
      ? `Registro de comentario en estado [${nuevoEstado.toUpperCase().replace('_', ' ')}]`
      : `Cambió estado de [${selectedItem.estado.toUpperCase().replace('_', ' ')}] a [${nuevoEstado.toUpperCase().replace('_', ' ')}]`;

    // Invocamos la función global del contexto. Esto actualiza `tareas` y su historial a la vez.
    actualizarTarea(selectedItem.id, { estado: nuevoEstado }, accionDetalle, motivo.trim());
    
    // Cerramos el panel después de registrar para reflejar que la fuente de verdad es la global
    setSelectedItem(null);
    setMotivo("");
  };

  // Necesitamos buscar el elemento actualizado de la lista global si el panel sigue abierto (aunque en este caso lo cerramos al guardar)
  const currentDisplayedItem = selectedItem ? tareas.find(t => t.id === selectedItem.id) : null;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div><h1 style={S.title}>Flujo de Trazabilidad</h1><p style={S.subtitle}>Monitoreo y auditoría de cambios de estado e historial técnico en tiempo real</p></div>
      </div>

      <div style={S.filters}>
        <div style={S.filterInputWrap}>
          <svg width="14" height="14" fill="none" stroke={C.muted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={S.filterInput} placeholder="Buscar por tarea o código..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.filterSelect} value={fEstado} onChange={e => setFEstado(e.target.value)}>
          <option value="">Todos los estados actuales</option><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr><th style={S.th}>Código</th><th style={S.th}>Tarea / Actividad</th><th style={S.th}>Estado Actual</th><th style={S.th}>Última Modificación</th><th style={S.th}>Cambios</th><th style={S.th}>Acciones</th></tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{...S.td, ...S.tdName, color: C.muted}}>{item.codigo}</td>
                <td style={S.td}><div style={S.tdName}>{item.titulo}</div><div style={S.tdSub}>Iniciado por: @{item.historial[item.historial.length - 1].usuario}</div></td>
                <td style={S.td}><span style={S.badge(C.status[item.estado] || C.status.pendiente)}>{item.estado.replace('_', ' ')}</span></td>
                <td style={{...S.td, color: C.muted}}>{item.ultimaModif}</td>
                <td style={S.td}><strong>{item.historial.length}</strong> registros</td>
                <td style={S.td}>
                  <button style={S.actionBtn} onClick={() => handleOpenPanel(item)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Ver / Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentDisplayedItem && (
        <>
          <div style={S.overlay} onClick={() => setSelectedItem(null)}></div>
          <div style={S.sidePanel}>
            <div style={S.modalHeader}>
              <div><h3 style={S.modalTitle}>{currentDisplayedItem.titulo}</h3><div style={{fontSize: "12px", color: C.muted, marginTop: "4px"}}>Código: {currentDisplayedItem.codigo}</div></div>
              <button style={S.modalClose} onClick={() => setSelectedItem(null)}>✕</button>
            </div>
            
            <div style={S.panelBody}>
              <div>
                <div style={S.secTitle}>Cambiar Estado / Añadir Bitácora</div>
                <div style={S.formGroup}>
                  <label style={S.label}>Nuevo Estado *</label>
                  <select style={S.input} value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
                    <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Motivo / Nota del Cambio *</label>
                  <textarea style={{...S.input, minHeight: "70px", resize: "vertical"}} placeholder="Ej: Se inicia instalación en obra tras validación de conserjería." value={motivo} onChange={e => setMotivo(e.target.value)}></textarea>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", marginTop: "4px"}}>
                  <button style={S.btnPrimary} onClick={handleRegistrar}>Registrar en Bitácora</button>
                </div>
              </div>

              <div>
                <div style={S.secTitle}>Línea de Tiempo (Auditada)</div>
                <div style={S.timeline}>
                  {currentDisplayedItem.historial.map((h, i) => (
                    <div key={i} style={S.timelineItem}>
                      <div style={S.timelineDot}></div>
                      {i !== currentDisplayedItem.historial.length - 1 && <div style={S.timelineLine}></div>}
                      <div style={S.tMeta}><span style={S.tUser}>@{h.usuario}</span><span>{h.fecha}</span></div>
                      <div style={S.tDesc}>{h.accion}</div>
                      {h.nota && <div style={S.tNote}>"{h.nota}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={S.modalFooter}>
              <button style={S.btnSecondary} onClick={() => setSelectedItem(null)}>Cerrar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Trazabilidad;