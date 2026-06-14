import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:        "#f4f6f9",
  surface:   "#ffffff",
  border:    "#e2e8f0",
  accent:    "#eb6425",
  accentHov: "#d0551c",
  danger:    "#ef4444",
  dangerBg:  "#fee2e2",
  success:   "#16a34a",
  successBg: "#f0fdf4",
  purple:    "#7c3aed",
  purpleBg:  "#f5f3ff",
  warn:      "#d97706",
  warnBg:    "#fef3c7",
  text:      "#0f172a",
  muted:     "#64748b",
};

const S = {
  page: { padding: "0 0 40px 0" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: C.text, margin: 0 },
  subtitle: { fontSize: "13px", color: C.muted, marginTop: "4px" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s", whiteSpace: "nowrap" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" },
  btnDanger: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.danger, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" },
  btnSuccess: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.success, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" },
  
  filters: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  filterInputWrap: { display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", flex: 1, maxWidth: "340px" },
  filterInput: { border: "none", background: "transparent", outline: "none", fontSize: "12px", color: C.text, width: "100%" },
  filterSelect: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "7px 10px", fontSize: "12px", color: C.text, outline: "none", cursor: "pointer" },
  
  tableCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted, borderBottom: `1px solid ${C.border}`, background: "#f8fafc", whiteSpace: "nowrap" },
  td: { padding: "12px 16px", fontSize: "12px", color: C.text, borderBottom: `1px solid #f1f5f9`, verticalAlign: "middle" },
  tdName: { fontWeight: "600" },
  tdSub: { fontSize: "11px", color: C.muted, marginTop: "2px" },
  badge: (colors) => ({ display: "inline-flex", alignItems: "center", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "10px", whiteSpace: "nowrap", background: colors.bg, color: colors.text, textTransform: "capitalize" }),
  
  actions: { display: "flex", gap: "6px", alignItems: "center" },
  actionBtn: (colors) => ({ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 10px", borderRadius: "6px", border: `1px solid ${colors.border}`, background: C.surface, fontSize: "11px", fontWeight: "600", color: colors.text, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }),

  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" },
  
  modal: { background: C.surface, borderRadius: "12px", width: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: C.text, margin: 0 },
  modalClose: { background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" },
  modalBody: { padding: "20px", display: "flex", flexDirection: "column", gap: "20px" },
  modalFooter: { padding: "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: "8px", background: "#f8fafc" },
  
  sidePanel: { position: "fixed", top: 0, right: 0, bottom: 0, width: "520px", background: C.surface, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column" },
  panelTabs: { display: "flex", borderBottom: `2px solid ${C.border}`, flexShrink: 0 },
  pTab: (active) => ({ padding: "12px 16px", fontSize: "13px", fontWeight: active ? "600" : "500", color: active ? C.accent : C.muted, cursor: "pointer", borderBottom: `2px solid ${active ? C.accent : "transparent"}`, marginBottom: "-2px", transition: "all 0.15s", whiteSpace: "nowrap" }),
  panelBody: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" },
  
  secTitle: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: "12px", paddingBottom: "6px", borderBottom: `1px solid #f1f5f9` },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: C.text },
  input: { border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: C.text, outline: "none", width: "100%", boxSizing: "border-box", background: C.surface },
  
  otCard: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" },
  
  confirmBox: { background: C.surface, borderRadius: "12px", width: "380px", padding: "28px 24px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  confirmIcon: (bg) => ({ width: "44px", height: "44px", borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }),
  confirmTitle: { fontSize: "16px", fontWeight: "700", textAlign: "center", margin: "0 0 8px", color: C.text },
  confirmMsg: { fontSize: "13px", color: C.muted, textAlign: "center", lineHeight: 1.5, margin: "0 0 24px" },
  confirmBtns: { display: "flex", gap: "8px", justifyContent: "center" }
};

const Obras = () => {
  const navigate = useNavigate();
  const [obras, setObras] = useState([]);
  const [search, setSearch] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [clientesLista, setClientesLista] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [clienteSearch, setClienteSearch] = useState("");
  const [selectedObra, setSelectedObra] = useState(null);
  const [activeTab, setActiveTab] = useState("obra");
  const [confirmAction, setConfirmAction] = useState(null);
  const [ordenTrabajo, setOrdenTrabajo] = useState(null);
  const [otDetalle, setOtDetalle] = useState(null);
  const [loadingOT, setLoadingOT] = useState(false);
  const [otEstadoEdit, setOtEstadoEdit] = useState("");
  
  const clientesFiltrados = clientesLista.filter(c =>
    c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    c.rut.includes(clienteSearch)
  );

  const emptyNewObra = { nombre: '', rut: '', razon: '', direccion: '', comuna: '', region: '', tipo: 'Instalación', cantidad: 1, puerta: { modelo: '', zona: '', sentido: 'Derecha', materialidad: '', hoja: '', diseno: '' } };
  const [newObra, setNewObra] = useState(emptyNewObra);

  useEffect(() => {
    fetch("http://localhost:3000/api/obras")
      .then(r => r.json())
      .then(d => { if (d.ok) setObras(d.obras); })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/clientes/selector")
      .then(r => r.json())
      .then(d => { if (d.ok) setClientesLista(d.clientes); })
      .catch(e => console.error(e));
  }, []);

  const filteredObras = obras.filter(o => {
    const matchText = o.nombre.toLowerCase().includes(search.toLowerCase()) || o.rut.includes(search) || o.ref.toLowerCase().includes(search.toLowerCase());
    const matchEst = !fEstado || o.estado === fEstado;
    const matchTip = !fTipo || o.tipo === fTipo;
    return matchText && matchEst && matchTip;
  });

  const getStatusBadgeColors = (estado) => {
    if (estado === "activa") return { bg: C.successBg, text: C.success };
    if (estado === "cancelada") return { bg: C.dangerBg, text: C.danger };
    if (estado === "completada") return { bg: C.purpleBg, text: C.purple };
    return { bg: C.bg, text: C.muted };
  };

  const fetchOrdenTrabajo = (especId) => {
    if (!especId) return;
    setLoadingOT(true);
    setOrdenTrabajo(null);
    setOtDetalle(null);
    fetch(`http://localhost:3000/api/orden-trabajo/especificacion/${especId}`)
      .then(r => r.ok ? r.json() : Promise.reject("No encontrada"))
      .then(d => {
        if (d.ok) {
          setOrdenTrabajo(d.orden);
          setOtEstadoEdit(d.orden.estado);
          fetch(`http://localhost:3000/api/orden-trabajo/${d.orden.id}/detalle`)
            .then(r => r.ok ? r.json() : null)
            .then(d2 => { if (d2?.ok) setOtDetalle(d2.detalle); })
            .catch(() => {});
        }
      })
      .catch(() => { setOrdenTrabajo(null); setOtDetalle(null); })
      .finally(() => setLoadingOT(false));
  };

  const handleOpenPanel = (obra) => {
    setSelectedObra(JSON.parse(JSON.stringify(obra)));
    setActiveTab("obra");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'ot' && selectedObra?.id_especificacion_puerta) {
      fetchOrdenTrabajo(selectedObra.id_especificacion_puerta);
    }
  };

  const handleFieldChange = (field, value, subObj = null) => {
    if (subObj) {
      setSelectedObra({ ...selectedObra, [subObj]: { ...selectedObra[subObj], [field]: value } });
    } else {
      setSelectedObra({ ...selectedObra, [field]: value });
    }
  };

  const handleSavePanel = () => {
    setObras(obras.map(o => o.id === selectedObra.id ? selectedObra : o));
    setSelectedObra(null);
  };

  const handleUpdateOTEstado = async () => {
    if (!ordenTrabajo?.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/orden-trabajo/${ordenTrabajo.id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: otEstadoEdit })
      });
      const data = await res.json();
      if (data.ok) {
        setOrdenTrabajo({ ...ordenTrabajo, estado: otEstadoEdit });
        alert("Estado actualizado");
      } else {
        alert("Error: " + (data.msg || "No se pudo actualizar"));
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const handleCreateOT = async () => {
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    const usuario_id = usuario.id;
    if (!usuario_id) return alert("Debes iniciar sesión para crear una orden de trabajo");
    if (!selectedObra?.id_especificacion_puerta) return alert("La obra no tiene especificación de puerta");
    try {
      const res = await fetch("http://localhost:3000/api/orden-trabajo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          especificacion_id: selectedObra.id_especificacion_puerta,
          usuario_id
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert("Orden de trabajo creada correctamente");
        fetchOrdenTrabajo(selectedObra.id_especificacion_puerta);
      } else {
        alert("Error: " + (data.msg || "No se pudo crear"));
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const executeConfirmAction = () => {
    const newState = confirmAction.type === 'cancelar' ? 'cancelada' : 'activa';
    setObras(obras.map(o => o.id === confirmAction.id ? { ...o, estado: newState } : o));
    setConfirmAction(null);
  };

  const handleCreateObra = async () => {
    if (!newObra.nombre) return alert('El nombre de la obra es obligatorio.');
    try {
      const res = await fetch("http://localhost:3000/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObra)
      });
      const data = await res.json();
      if (data.ok) {
        alert(data.msg);
        setShowNewModal(false);
        setNewObra(emptyNewObra);
        fetch("http://localhost:3000/api/obras")
          .then(r => r.json())
          .then(d => { if (d.ok) setObras(d.obras); });
      } else {
        alert("Error: " + data.msg);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Gestión de Obras</h1>
          <p style={S.subtitle}>Administración de obras con especificación de puertas</p>
        </div>
        <button style={S.btnPrimary} onMouseEnter={e => e.currentTarget.style.background = C.accentHov} onMouseLeave={e => e.currentTarget.style.background = C.accent} onClick={() => setShowNewModal(true)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Obra
        </button>
      </div>

      <div style={S.filters}>
        <div style={S.filterInputWrap}>
          <svg width="14" height="14" fill="none" stroke={C.muted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={S.filterInput} placeholder="Buscar por nombre, cliente o referencia..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.filterSelect} value={fEstado} onChange={e => setFEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activa">Activa</option>
          <option value="cancelada">Cancelada</option>
          <option value="completada">Completada</option>
        </select>
        <select style={S.filterSelect} value={fTipo} onChange={e => setFTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="Instalación">Instalación</option>
          <option value="Reemplazo">Reemplazo</option>
          <option value="Mantención">Mantención</option>
        </select>
      </div>

      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Nombre Obra</th>
              <th style={S.th}>Dirección</th>
              <th style={S.th}>Tipo</th>
              <th style={S.th}>Cliente</th>
              <th style={S.th}>Puertas</th>
              <th style={S.th}>Estado</th>
              <th style={S.th}>Creación</th>
              <th style={S.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredObras.length === 0 && <tr><td colSpan="8" style={{...S.td, textAlign: "center", color: C.muted}}>No se encontraron obras.</td></tr>}
            {filteredObras.map(o => (
              <tr key={o.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={S.td}><div style={S.tdName}>{o.nombre}</div><div style={S.tdSub}>{o.ref}</div></td>
                <td style={S.td}>{o.direccion}, {o.comuna}</td>
                <td style={S.td}>{o.tipo}</td>
                <td style={S.td}><div style={S.tdName}>{o.rut}</div><div style={S.tdSub}>{o.razon}</div></td>
                <td style={S.td}>{o.cantidad}</td>
                <td style={S.td}><span style={S.badge(getStatusBadgeColors(o.estado))}>{o.estado}</span></td>
                <td style={S.td}>{o.creacion}</td>
                <td style={S.td}>
                  <div style={S.actions}>
                    <button 
                      style={S.actionBtn({ border: C.border, text: C.muted })} 
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} 
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => handleOpenPanel(o)}
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Ver / Editar
                    </button>
                    {o.estado !== 'cancelada' ? (
                      <button 
                        style={S.actionBtn({ border: "#fca5a5", text: C.danger })} 
                        onMouseEnter={e => e.currentTarget.style.background = C.dangerBg} 
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => setConfirmAction({ id: o.id, type: 'cancelar' })}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        Cancelar
                      </button>
                    ) : (
                      <button 
                        style={S.actionBtn({ border: "#86efac", text: C.success })} 
                        onMouseEnter={e => e.currentTarget.style.background = C.successBg} 
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => setConfirmAction({ id: o.id, type: 'reactivar' })}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                        Reactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewModal && (
        <div style={S.overlay} onClick={e => { if(e.target === e.currentTarget) setShowNewModal(false); }}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}>Nueva Obra</h3>
              <button style={S.modalClose} onClick={() => setShowNewModal(false)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <div>
                <div style={S.secTitle}>Datos de la obra</div>
                <div style={S.grid2}>
                  <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Nombre obra *</label><input style={S.input} value={newObra.nombre} onChange={e => setNewObra({...newObra, nombre: e.target.value})} placeholder="Ej: Edificio Las Torres" /></div>
                  <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
                   <label style={S.label}>Seleccionar Cliente *</label>
                      <input
                        style={{...S.input, marginBottom: "6px"}}
                        placeholder="Buscar cliente por nombre o RUT..."
                        value={clienteSearch}
                        onChange={e => setClienteSearch(e.target.value)}
                      />
                      <select 
                        style={S.input} 
                        value={newObra.rut} 
                        onChange={e => {
                          const targetRut = e.target.value;
                          const clienteSeleccionado = clientesLista.find(c => c.rut === targetRut);
                          setNewObra({
                            ...newObra, 
                            rut: targetRut, 
                            razon: clienteSeleccionado ? clienteSeleccionado.nombre : ''
                          });
                        }}
                        required
                      >
                        <option value="">-- Seleccione un cliente --</option>
                        {clientesFiltrados.map(cliente => (
                          <option key={cliente.rut} value={cliente.rut}>
                            {cliente.nombre} ({cliente.rut})
                          </option>
                        ))}
                      </select>
                    </div>
                  <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Dirección *</label><input style={S.input} value={newObra.direccion} onChange={e => setNewObra({...newObra, direccion: e.target.value})} placeholder="Av. Principal 123" /></div>
                  <div style={S.formGroup}><label style={S.label}>Comuna</label><input style={S.input} value={newObra.comuna} onChange={e => setNewObra({...newObra, comuna: e.target.value})} placeholder="Santiago" /></div>
                  <div style={S.formGroup}><label style={S.label}>Región</label><input style={S.input} value={newObra.region} onChange={e => setNewObra({...newObra, region: e.target.value})} placeholder="Metropolitana" /></div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Tipo *</label>
                    <select style={S.input} value={newObra.tipo} onChange={e => setNewObra({...newObra, tipo: e.target.value})}>
                      <option value="Instalación">Instalación</option><option value="Reemplazo">Reemplazo</option><option value="Mantención">Mantención</option>
                    </select>
                  </div>
                  <div style={S.formGroup}><label style={S.label}>Cantidad puertas *</label><input style={S.input} type="number" min="1" value={newObra.cantidad} onChange={e => setNewObra({...newObra, cantidad: e.target.value})} /></div>
                </div>
              </div>
              <div>
                <div style={S.secTitle}>Especificación de puerta</div>
                <div style={S.grid2}>
                  <div style={S.formGroup}><label style={S.label}>Modelo</label><input style={S.input} value={newObra.puerta.modelo} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, modelo: e.target.value}})} placeholder="Modelo A" /></div>
                  <div style={S.formGroup}><label style={S.label}>Zona</label><input style={S.input} value={newObra.puerta.zona} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, zona: e.target.value}})} placeholder="Zona Norte" /></div>
                  <div style={S.formGroup}>
                    <label style={S.label}>Sentido apertura</label>
                    <select style={S.input} value={newObra.puerta.sentido} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, sentido: e.target.value}})}>
                      <option>Derecha</option><option>Izquierda</option>
                    </select>
                  </div>
                  <div style={S.formGroup}><label style={S.label}>Materialidad vano</label><input style={S.input} value={newObra.puerta.materialidad} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, materialidad: e.target.value}})} placeholder="Hormigón" /></div>
                  <div style={S.formGroup}><label style={S.label}>Hoja activa</label><input style={S.input} value={newObra.puerta.hoja} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, hoja: e.target.value}})} placeholder="Hoja simple" /></div>
                  <div style={S.formGroup}><label style={S.label}>Diseño</label><input style={S.input} value={newObra.puerta.diseno} onChange={e => setNewObra({...newObra, puerta: {...newObra.puerta, diseno: e.target.value}})} placeholder="Estándar" /></div>
                </div>
              </div>
            </div>
            <div style={S.modalFooter}>
              <button style={S.btnSecondary} onClick={() => setShowNewModal(false)}>Cancelar</button>
              <button style={S.btnPrimary} onClick={handleCreateObra}>Crear Obra</button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div style={S.overlay}>
          <div style={S.confirmBox}>
            <div style={S.confirmIcon(confirmAction.type === 'cancelar' ? C.warnBg : C.successBg)}>
              {confirmAction.type === 'cancelar' ? (
                <svg width="24" height="24" fill="none" stroke={C.warn} strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke={C.success} strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              )}
            </div>
            <h3 style={S.confirmTitle}>{confirmAction.type === 'cancelar' ? '¿Cancelar obra?' : '¿Reactivar obra?'}</h3>
            <p style={S.confirmMsg}>
              {confirmAction.type === 'cancelar' 
                ? 'Estás a punto de cancelar esta obra. Esta acción puede revertirse luego.' 
                : 'Estás a punto de reactivar esta obra y cambiar su estado.'}
            </p>
            <div style={S.confirmBtns}>
              <button style={S.btnSecondary} onClick={() => setConfirmAction(null)}>No, volver</button>
              <button style={confirmAction.type === 'cancelar' ? S.btnDanger : S.btnSuccess} onClick={executeConfirmAction}>
                {confirmAction.type === 'cancelar' ? 'Sí, cancelar' : 'Sí, reactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedObra && (
        <>
          <div style={S.overlay} onClick={() => setSelectedObra(null)}></div>
          <div style={S.sidePanel}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>{selectedObra.nombre}</h3>
                <div style={{fontSize: "12px", color: C.muted, marginTop: "4px"}}>{selectedObra.ref} · ID #{selectedObra.id}</div>
              </div>
              <button style={S.modalClose} onClick={() => setSelectedObra(null)}>✕</button>
            </div>
            
            <div style={S.panelTabs}>
              <div style={S.pTab(activeTab === 'obra')} onClick={() => handleTabChange('obra')}>Datos de obra</div>
              <div style={S.pTab(activeTab === 'puerta')} onClick={() => handleTabChange('puerta')}>Puerta</div>
              <div style={S.pTab(activeTab === 'notaventa')} onClick={() => handleTabChange('notaventa')}>Nota de venta</div>
              <div style={S.pTab(activeTab === 'ot')} onClick={() => handleTabChange('ot')}>Orden de trabajo</div>
            </div>

            <div style={S.panelBody}>
              {activeTab === 'obra' && (
                <>
                  <div>
                    <div style={S.secTitle}>Información general</div>
                    <div style={S.grid2}>
                      <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Nombre de obra</label><input style={S.input} value={selectedObra.nombre} onChange={e => handleFieldChange('nombre', e.target.value)} /></div>
                      <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Dirección</label><input style={S.input} value={selectedObra.direccion} onChange={e => handleFieldChange('direccion', e.target.value)} /></div>
                      <div style={S.formGroup}><label style={S.label}>Comuna</label><input style={S.input} value={selectedObra.comuna} onChange={e => handleFieldChange('comuna', e.target.value)} /></div>
                      <div style={S.formGroup}><label style={S.label}>Región</label><input style={S.input} value={selectedObra.region} onChange={e => handleFieldChange('region', e.target.value)} /></div>
                      <div style={S.formGroup}>
                        <label style={S.label}>Tipo de instalación</label>
                        <select style={S.input} value={selectedObra.tipo} onChange={e => handleFieldChange('tipo', e.target.value)}>
                          <option>Instalación</option><option>Reemplazo</option><option>Mantención</option>
                        </select>
                      </div>
                      <div style={S.formGroup}>
                        <label style={S.label}>Estado</label>
                        <select style={S.input} value={selectedObra.estado} onChange={e => handleFieldChange('estado', e.target.value)}>
                          <option value="activa">Activa</option><option value="cancelada">Cancelada</option><option value="completada">Completada</option>
                        </select>
                      </div>
                      <div style={S.formGroup}><label style={S.label}>Cantidad puertas</label><input style={S.input} type="number" min="1" value={selectedObra.cantidad} onChange={e => handleFieldChange('cantidad', e.target.value)} /></div>
                    </div>
                  </div>
                  <div>
                    <div style={S.secTitle}>Cliente</div>
                    <div style={S.grid2}>
                      <div style={S.formGroup}><label style={S.label}>RUT cliente</label><input style={S.input} value={selectedObra.rut} onChange={e => handleFieldChange('rut', e.target.value)} /></div>
                      <div style={S.formGroup}><label style={S.label}>Razón social</label><input style={S.input} value={selectedObra.razon} onChange={e => handleFieldChange('razon', e.target.value)} /></div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'puerta' && (
                <div>
                  <div style={S.secTitle}>Especificación de puerta</div>
                  <div style={S.grid2}>
                    <div style={S.formGroup}><label style={S.label}>Modelo</label><input style={S.input} value={selectedObra.puerta.modelo} onChange={e => handleFieldChange('modelo', e.target.value, 'puerta')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Zona</label><input style={S.input} value={selectedObra.puerta.zona} onChange={e => handleFieldChange('zona', e.target.value, 'puerta')} /></div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Sentido apertura</label>
                      <select style={S.input} value={selectedObra.puerta.sentido} onChange={e => handleFieldChange('sentido', e.target.value, 'puerta')}>
                        <option>Derecha</option><option>Izquierda</option>
                      </select>
                    </div>
                    <div style={S.formGroup}><label style={S.label}>Materialidad</label><input style={S.input} value={selectedObra.puerta.materialidad} onChange={e => handleFieldChange('materialidad', e.target.value, 'puerta')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Hoja activa</label><input style={S.input} value={selectedObra.puerta.hoja} onChange={e => handleFieldChange('hoja', e.target.value, 'puerta')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Diseño</label><input style={S.input} value={selectedObra.puerta.diseno} onChange={e => handleFieldChange('diseno', e.target.value, 'puerta')} /></div>
                    <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Observaciones</label><textarea style={{...S.input, minHeight: "60px", resize: "vertical"}} value={selectedObra.puerta.obs} onChange={e => handleFieldChange('obs', e.target.value, 'puerta')}></textarea></div>
                  </div>
                  {selectedObra.id_especificacion_puerta && (
                    <div style={{ marginTop: "16px" }}>
                      <button
                        onClick={() => navigate(`/dashboard/editar-terminaciones/${selectedObra.id_especificacion_puerta}`)}
                        style={{...S.btnPrimary, background: "#7c3aed"}}
                      >
                        Editar Terminaciones y Metalmecánica
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notaventa' && (
                <div>
                  <div style={S.secTitle}>Nota de venta</div>
                  <div style={S.grid2}>
                    <div style={S.formGroup}><label style={S.label}>N° Nota de venta</label><input style={S.input} value={selectedObra.notaventa.numero} onChange={e => handleFieldChange('numero', e.target.value, 'notaventa')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Fecha emisión</label><input style={S.input} type="date" value={selectedObra.notaventa.fecha} onChange={e => handleFieldChange('fecha', e.target.value, 'notaventa')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Vendedor</label><input style={S.input} value={selectedObra.notaventa.vendedor} onChange={e => handleFieldChange('vendedor', e.target.value, 'notaventa')} /></div>
                    <div style={S.formGroup}><label style={S.label}>Monto total</label><input style={S.input} value={selectedObra.notaventa.monto} onChange={e => handleFieldChange('monto', e.target.value, 'notaventa')} /></div>
                    <div style={{...S.formGroup, gridColumn: "1 / -1"}}><label style={S.label}>Observaciones</label><textarea style={{...S.input, minHeight: "60px", resize: "vertical"}} value={selectedObra.notaventa.obs} onChange={e => handleFieldChange('obs', e.target.value, 'notaventa')}></textarea></div>
                  </div>
                </div>
              )}

              {activeTab === 'ot' && (
                <div>
                  <div style={S.secTitle}>Orden de trabajo asociada</div>
                  {loadingOT ? (
                    <div style={{color: C.muted, fontSize: "13px", padding: "12px 0"}}>Cargando...</div>
                  ) : ordenTrabajo && otDetalle ? (
                    <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                      {/* Cabecera OT */}
                      <div style={S.otCard}>
                        <div>
                          <div style={{fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "4px"}}>OT #{ordenTrabajo.id}</div>
                          <div style={{fontSize: "12px", color: C.muted}}>Creada por: {ordenTrabajo.usuario_nombre || ordenTrabajo.usuario_username || '—'}</div>
                          <div style={{fontSize: "11px", color: C.muted, marginTop: "4px"}}>Fecha: {ordenTrabajo.fecha ? new Date(ordenTrabajo.fecha).toLocaleString('es-CL') : '—'}</div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end"}}>
                          <span style={S.badge(getStatusBadgeColors(ordenTrabajo.estado === 'pendiente' ? 'activa' : ordenTrabajo.estado))}>{ordenTrabajo.estado}</span>
                        </div>
                      </div>

                      {/* Cambiar estado */}
                      <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                        <label style={{...S.label, margin: 0, whiteSpace: "nowrap"}}>Estado:</label>
                        <select style={{...S.input, width: "auto", flex: 1}} value={otEstadoEdit} onChange={e => setOtEstadoEdit(e.target.value)}>
                          <option value="pendiente">Pendiente</option>
                          <option value="en_progreso">En progreso</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                        <button style={S.btnPrimary} onClick={handleUpdateOTEstado}>Actualizar</button>
                      </div>

                      {/* Obra y Cliente */}
                      {otDetalle.obra && (
                        <div>
                          <div style={S.secTitle}>Obra</div>
                          <div style={S.readCard}>
                            <div><div style={S.rcLabel}>Nombre</div><div style={S.rcValue}>{otDetalle.obra.nombre_obra || '—'}</div></div>
                            <div><div style={S.rcLabel}>Dirección</div><div style={S.rcValue}>{otDetalle.obra.direccion_obra || '—'}</div></div>
                            <div><div style={S.rcLabel}>Comuna</div><div style={S.rcValue}>{otDetalle.obra.comuna || '—'}</div></div>
                            <div><div style={S.rcLabel}>Región</div><div style={S.rcValue}>{otDetalle.obra.region || '—'}</div></div>
                            <div><div style={S.rcLabel}>Cliente</div><div style={S.rcValue}>{otDetalle.obra.razon_social || otDetalle.obra.rut_cliente || '—'}</div></div>
                          </div>
                        </div>
                      )}

                      {/* Especificación Puerta */}
                      {otDetalle.especificacion && (
                        <div>
                          <div style={S.secTitle}>Especificación de puerta</div>
                          <div style={S.readCard}>
                            <div><div style={S.rcLabel}>Modelo</div><div style={S.rcValue}>{otDetalle.especificacion.modelo_puerta || '—'}</div></div>
                            <div><div style={S.rcLabel}>Zona</div><div style={S.rcValue}>{otDetalle.especificacion.zona || '—'}</div></div>
                            <div><div style={S.rcLabel}>Sentido apertura</div><div style={S.rcValue}>{otDetalle.especificacion.sentido_apertura || '—'}</div></div>
                            <div><div style={S.rcLabel}>Materialidad vano</div><div style={S.rcValue}>{otDetalle.especificacion.materialidad_vano || '—'}</div></div>
                            <div><div style={S.rcLabel}>Hoja activa</div><div style={S.rcValue}>{otDetalle.especificacion.hoja_activa || '—'}</div></div>
                            <div><div style={S.rcLabel}>Diseño</div><div style={S.rcValue}>{otDetalle.especificacion.diseno_puerta || '—'}</div></div>
                            <div style={{gridColumn: "1 / -1"}}><div style={S.rcLabel}>Observaciones</div><div style={S.rcValue}>{otDetalle.especificacion.observaciones || '—'}</div></div>
                          </div>
                        </div>
                      )}

                      {/* Terminaciones */}
                      {otDetalle.terminaciones && (
                        <div>
                          <div style={S.secTitle}>Terminaciones</div>
                          <div style={S.readCard}>
                            <div><div style={S.rcLabel}>Herrajes</div><div style={S.rcValue}>{otDetalle.terminaciones.herrajes || '—'}</div></div>
                            <div><div style={S.rcLabel}>Enchape</div><div style={S.rcValue}>{otDetalle.terminaciones.enchape || '—'}</div></div>
                            <div><div style={S.rcLabel}>Molduras</div><div style={S.rcValue}>{otDetalle.terminaciones.molduras || '—'}</div></div>
                            <div><div style={S.rcLabel}>Bisagras</div><div style={S.rcValue}>{otDetalle.terminaciones.bisagras ?? '—'}</div></div>
                            <div><div style={S.rcLabel}>Marco metálico</div><div style={S.rcValue}>{otDetalle.terminaciones.marco_metalico ? 'Sí' : 'No'}</div></div>
                            <div><div style={S.rcLabel}>Medida final</div><div style={S.rcValue}>{otDetalle.terminaciones.medida_final ?? '—'}</div></div>
                            <div><div style={S.rcLabel}>Pletina</div><div style={S.rcValue}>{otDetalle.terminaciones.pletina ?? '—'}</div></div>
                            <div><div style={S.rcLabel}>Funda</div><div style={S.rcValue}>{otDetalle.terminaciones.funda ?? '—'}</div></div>
                            <div><div style={S.rcLabel}>Rebaje</div><div style={S.rcValue}>{otDetalle.terminaciones.rebaje || '—'}</div></div>
                            <div><div style={S.rcLabel}>Canterías</div><div style={S.rcValue}>{otDetalle.terminaciones.canterias || '—'}</div></div>
                          </div>
                        </div>
                      )}

                      {/* Metalmecánica */}
                      {otDetalle.metalmecanica && (
                        <div>
                          <div style={S.secTitle}>Metalmecánica</div>
                          <div style={S.readCard}>
                            <div><div style={S.rcLabel}>Bastidor</div><div style={S.rcValue}>{otDetalle.metalmecanica.bastidor || '—'}</div></div>
                            <div><div style={S.rcLabel}>Cerradura</div><div style={S.rcValue}>{otDetalle.metalmecanica.cerradura || '—'}</div></div>
                            <div><div style={S.rcLabel}>Manillón</div><div style={S.rcValue}>{otDetalle.metalmecanica.manillon || '—'}</div></div>
                            <div><div style={S.rcLabel}>Pernos fijos</div><div style={S.rcValue}>{otDetalle.metalmecanica.pernos_fijos || '—'}</div></div>
                            <div><div style={S.rcLabel}>Manilla</div><div style={S.rcValue}>{otDetalle.metalmecanica.manilla || '—'}</div></div>
                            <div><div style={S.rcLabel}>Herraje</div><div style={S.rcValue}>{otDetalle.metalmecanica.herraje || '—'}</div></div>
                            <div><div style={S.rcLabel}>Cerrojo</div><div style={S.rcValue}>{otDetalle.metalmecanica.cerrojo || '—'}</div></div>
                            <div><div style={S.rcLabel}>Ojo</div><div style={S.rcValue}>{otDetalle.metalmecanica.ojo || '—'}</div></div>
                            <div style={{gridColumn: "1 / -1"}}><div style={S.rcLabel}>Otros</div><div style={S.rcValue}>{otDetalle.metalmecanica.otros || '—'}</div></div>
                          </div>
                        </div>
                      )}

                      {/* Herrajes */}
                      {otDetalle.herrajes?.length > 0 && (
                        <div>
                          <div style={S.secTitle}>Detalles de herrajes</div>
                          {otDetalle.herrajes.map((h, i) => (
                            <div key={i} style={S.readCard}>
                              <div><div style={S.rcLabel}>Ubicación</div><div style={S.rcValue}>{h.ubicacion || '—'}</div></div>
                              <div><div style={S.rcLabel}>Color</div><div style={S.rcValue}>{h.color || '—'}</div></div>
                              <div><div style={S.rcLabel}>Cantidad</div><div style={S.rcValue}>{h.cantidad ?? '—'}</div></div>
                              <div style={{gridColumn: "1 / -1"}}><div style={S.rcLabel}>Observación</div><div style={S.rcValue}>{h.observacion || '—'}</div></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.5}}>
                        No hay orden de trabajo asociada a esta especificación de puerta.
                      </div>
                      <button style={S.btnPrimary} onClick={handleCreateOT}>
                        Crear Orden de Trabajo
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div style={S.modalFooter}>
              <button style={S.btnSecondary} onClick={() => setSelectedObra(null)}>Cancelar</button>
              <button style={S.btnPrimary} onClick={handleSavePanel}>Guardar cambios</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Obras;
