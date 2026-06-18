import { useState, useEffect } from "react";

const C = {
  bg:        "#f4f6f9",
  surface:   "#ffffff",
  border:    "#e2e8f0",
  accent:    "#eb6425",
  accentHov: "#eb6425",
  danger:    "#ef4444",
  text:      "#0f172a",
  muted:     "#64748b",
  b2b:       { bg: "#dbeafe", text: "#1e40af" },
  b2c:       { bg: "#fef3c7", text: "#92400e" },
};

const S = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: C.text,
    padding: "32px 40px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: C.text,
    letterSpacing: "-0.3px",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: C.muted,
    marginTop: "3px",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  card: {
    background: C.surface,
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13.5px",
  },
  th: {
    textAlign: "left",
    padding: "11px 16px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: C.muted,
    background: "#f8fafc",
    borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 16px",
    borderBottom: `1px solid ${C.border}`,
    color: C.text,
    verticalAlign: "middle",
  },
  badge: (tipo) => ({
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    backgroundColor: tipo === "B2B" ? C.b2b.bg : C.b2c.bg,
    color: tipo === "B2B" ? C.b2b.text : C.b2c.text,
  }),
  btnEdit: {
    background: "transparent",
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    padding: "4px 12px",
    fontSize: "12px",
    color: C.accent,
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: C.surface,
    borderRadius: "14px",
    width: "480px",
    maxHeight: "88vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    padding: "28px 30px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "22px",
  },
  modalTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: C.text,
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: C.muted,
    lineHeight: 1,
    padding: "0 4px",
  },
  segmented: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "3px",
    marginBottom: "22px",
  },
  segBtn: (active) => ({
    flex: 1,
    padding: "7px 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
    background: active ? C.surface : "transparent",
    color: active ? C.accent : C.muted,
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
  }),
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.muted,
    margin: "18px 0 10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  divider: {
    flex: 1,
    height: "1px",
    background: C.border,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  fieldWrap: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontSize: "11.5px",
    fontWeight: "600",
    color: C.muted,
    marginBottom: "4px",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 11px",
    fontSize: "13px",
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: "7px",
    outline: "none",
    transition: "border-color 0.15s",
    background: "#fff",
  },
  inputDisabled: {
    background: "#f8fafc",
    color: C.muted,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: `1px solid ${C.border}`,
  },
  btnCancel: {
    padding: "8px 18px",
    border: `1px solid ${C.border}`,
    borderRadius: "7px",
    background: "transparent",
    color: C.muted,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSave: {
    padding: "8px 20px",
    border: "none",
    borderRadius: "7px",
    background: C.accent,
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "48px 0",
    color: C.muted,
    fontSize: "14px",
  },
};

const Field = ({ label, name, value, onChange, type = "text", required = false, disabled = false, style = {} }) => (
  <div style={{ ...S.fieldWrap, ...style }}>
    <label style={S.label}>
      {label}{required && <span style={{ color: C.accent }}> *</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      style={{ ...S.input, ...(disabled ? S.inputDisabled : {}) }}
    />
  </div>
);

const Section = ({ children }) => (
  <div style={S.sectionLabel}>
    {children}
    <div style={S.divider} />
  </div>
);

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [tipoCliente, setTipoCliente] = useState("B2C");
  const [hoveredRow, setHoveredRow] = useState(null);

  const emptyForm = {
    rut_cliente: "", correo: "", telefono: "", telefono_adicional: "",
    cliente_b2c_primer_nombre: "", cliente_b2c_segundo_nombre: "",
    cliente_b2c_primer_apellido: "", cliente_b2c_segundo_apellido: "",
    cliente_b2c_telefono_contacto: "", cliente_b2c_telefono_contacto_adicional: "",
    cliente_b2b_razon_social: "", cliente_b2b_correo_institucional: "",
    cliente_b2b_telefono_corporativo: "", cliente_b2b_telefono_corp_adicional: "",
    cliente_b2b_representante_legal_primer_nombre: "",
    cliente_b2b_representante_legal_segundo_nombre: "",
    cliente_b2b_representante_legal_primer_apellido: "",
    cliente_b2b_representante_legal_segundo_apellido: "",
  };

  const [form, setForm] = useState(emptyForm);

  const resetForm = () => { setForm(emptyForm); setEditingCliente(null); };

  const cargarClientes = () => {
    fetch("http://localhost:3000/api/clientes")
      .then(r => r.json())
      .then(d => { if (d.ok) setClientes(d.clientes); })
      .catch(e => console.error(e));
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rut_cliente") {
      const v = value.replace(/[^\dKk-]/g, '').toUpperCase();
      if (v.length > 1 && !v.includes('-') && v.length <= 9) {
        setForm({ ...form, [name]: v.slice(0, -1) + '-' + v.slice(-1) });
        return;
      }
      setForm({ ...form, [name]: v.substring(0, 10) });
      return;
    }
    if (name.includes("telefono")) {
      setForm({ ...form, [name]: value.replace(/[^+\d]/g, '').substring(0, 15) });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleEditClick = (c) => {
    setEditingCliente(c.identificador);
    setTipoCliente(c.tipo);
    
    if (c.tipo === "B2C") {
      setForm({
        ...emptyForm,
        rut_cliente: c.identificador,
        correo: c.email || "",
        telefono: c.telefono || "",
        telefono_adicional: c.telefono_adicional || "",
        cliente_b2c_primer_nombre: c.cliente_b2c_primer_nombre || "",
        cliente_b2c_segundo_nombre: c.cliente_b2c_segundo_nombre || "",
        cliente_b2c_primer_apellido: c.cliente_b2c_primer_apellido || "",
        cliente_b2c_segundo_apellido: c.cliente_b2c_segundo_apellido || "",
        cliente_b2c_telefono_contacto: c.cliente_b2c_telefono_contacto || c.telefono || "",
        cliente_b2c_telefono_contacto_adicional: c.cliente_b2c_telefono_contacto_adicional || c.telefono_adicional || ""
      });
    } else {
      setForm({
        ...emptyForm,
        rut_cliente: c.identificador,
        correo: c.email || "",
        telefono: c.telefono || "",
        telefono_adicional: c.telefono_adicional || "",
        cliente_b2b_razon_social: c.cliente_b2b_razon_social || c.nombre || "",
        cliente_b2b_correo_institucional: c.cliente_b2b_correo_institucional || c.email || "",
        cliente_b2b_telefono_corporativo: c.cliente_b2b_telefono_corporativo || c.telefono || "",
        cliente_b2b_telefono_corp_adicional: c.cliente_b2b_telefono_corp_adicional || c.telefono_adicional || "",
        cliente_b2b_representante_legal_primer_nombre: c.cliente_b2b_representante_legal_primer_nombre || "",
        cliente_b2b_representante_legal_segundo_nombre: c.cliente_b2b_representante_legal_segundo_nombre || "",
        cliente_b2b_representante_legal_primer_apellido: c.cliente_b2b_representante_legal_primer_apellido || "",
        cliente_b2b_representante_legal_segundo_apellido: c.cliente_b2b_representante_legal_segundo_apellido || ""
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!/^\d{7,8}-[\dkK]$/.test(form.rut_cliente.trim())) {
      alert("El RUT debe tener formato XXXXXXXX-X (ej: 12345678-9).");
      return;
    }
    if (tipoCliente === "B2C" && form.cliente_b2c_telefono_contacto) {
      if (!/^[\d+]+$/.test(form.cliente_b2c_telefono_contacto)) {
        alert("El teléfono solo puede contener números y +");
        return;
      }
    }
    if (tipoCliente === "B2B" && form.cliente_b2b_telefono_corporativo) {
      if (!/^[\d+]+$/.test(form.cliente_b2b_telefono_corporativo)) {
        alert("El teléfono corporativo solo puede contener números y +");
        return;
      }
    }
    const url = editingCliente
      ? `http://localhost:3000/api/clientes/${editingCliente}`
      : "http://localhost:3000/api/clientes";
    const payload = tipoCliente === "B2C"
      ? { tipo:"B2C", rut_cliente:form.rut_cliente, correo:form.correo,
          telefono:form.telefono, telefono_adicional:form.telefono_adicional,
          cliente_b2c_primer_nombre:form.cliente_b2c_primer_nombre,
          cliente_b2c_segundo_nombre:form.cliente_b2c_segundo_nombre,
          cliente_b2c_primer_apellido:form.cliente_b2c_primer_apellido,
          cliente_b2c_segundo_apellido:form.cliente_b2c_segundo_apellido,
          cliente_b2c_telefono_contacto:form.cliente_b2c_telefono_contacto,
          cliente_b2c_telefono_contacto_adicional:form.cliente_b2c_telefono_contacto_adicional }
      : { tipo:"B2B", rut_cliente:form.rut_cliente, correo:form.correo,
          telefono:form.telefono, telefono_adicional:form.telefono_adicional,
          cliente_b2b_razon_social:form.cliente_b2b_razon_social,
          cliente_b2b_correo_institucional:form.cliente_b2b_correo_institucional,
          cliente_b2b_telefono_corporativo:form.cliente_b2b_telefono_corporativo,
          cliente_b2b_telefono_corp_adicional:form.cliente_b2b_telefono_corp_adicional,
          cliente_b2b_representante_legal_primer_nombre:form.cliente_b2b_representante_legal_primer_nombre,
          cliente_b2b_representante_legal_segundo_nombre:form.cliente_b2b_representante_legal_segundo_nombre,
          cliente_b2b_representante_legal_primer_apellido:form.cliente_b2b_representante_legal_primer_apellido,
          cliente_b2b_representante_legal_segundo_apellido:form.cliente_b2b_representante_legal_segundo_apellido };
    try {
      const res = await fetch(url, { method: editingCliente ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.ok) { alert(data.msg); setShowModal(false); resetForm(); cargarClientes(); }
      else alert("Error: " + data.msg);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Registro de Clientes</h1>
          <p style={S.subtitle}>{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado{clientes.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          style={S.btnPrimary}
          onMouseEnter={e => e.currentTarget.style.background = C.accentHov}
          onMouseLeave={e => e.currentTarget.style.background = C.accent}
          onClick={() => { resetForm(); setTipoCliente("B2C"); setShowModal(true); }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Nuevo Cliente
        </button>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Tipo","RUT / Identificador","Nombre o Razón Social","Teléfono","Email","Última actualización",""].map((h, i) => (
                <th key={i} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 && (
              <tr><td colSpan={7} style={S.empty}>Sin clientes registrados aún.</td></tr>
            )}
            {clientes.map((c) => (
              <tr
                key={c.identificador}
                onMouseEnter={() => setHoveredRow(c.identificador)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === c.identificador ? "#f8fafc" : "#fff", transition: "background 0.1s" }}
              >
                <td style={S.td}>
                  <span style={S.badge(c.tipo)}>{c.tipo}</span>
                </td>
                <td style={{ ...S.td, fontFamily: "monospace", fontSize: "13px", color: C.muted }}>{c.identificador}</td>
                <td style={{ ...S.td, fontWeight: "500" }}>{c.nombre}</td>
                <td style={{ ...S.td, color: C.muted }}>{c.telefono || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                <td style={{ ...S.td, color: C.muted }}>{c.email}</td>
                <td style={{ ...S.td, color: C.muted, fontSize: "12px" }}>
                  {c.fecha_actualizacion ? new Date(c.fecha_actualizacion).toLocaleString("es-CL", { dateStyle:"short", timeStyle:"short" }) : "—"}
                </td>
                <td style={{ ...S.td, textAlign: "right" }}>
                  <button
                    style={S.btnEdit}
                    onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; }}
                    onClick={() => handleEditClick(c)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetForm(); } }}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>
                  {editingCliente ? "Editar Cliente" : "Registrar Cliente"}
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: C.muted }}>
                  {editingCliente ? `RUT: ${editingCliente}` : "Completa los datos del nuevo cliente"}
                </p>
              </div>
              <button style={S.modalClose} onClick={() => { setShowModal(false); resetForm(); }}>✕</button>
            </div>

            <div style={S.segmented}>
              {["B2C", "B2B"].map(t => (
                <button
                  key={t}
                  type="button"
                  disabled={!!editingCliente}
                  style={S.segBtn(tipoCliente === t)}
                  onClick={() => setTipoCliente(t)}
                >
                  {t === "B2C" ? " Persona Natural" : " Empresa"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave}>
              {tipoCliente === "B2C" && (
                <>
                  <Field label="RUT" name="rut_cliente" value={form.rut_cliente} onChange={handleChange} required disabled={!!editingCliente} />
                  <Section>Nombre</Section>
                  <div style={S.grid2}>
                    <Field label="Primer Nombre" name="cliente_b2c_primer_nombre" value={form.cliente_b2c_primer_nombre} onChange={handleChange} required />
                    <Field label="Segundo Nombre" name="cliente_b2c_segundo_nombre" value={form.cliente_b2c_segundo_nombre} onChange={handleChange} />
                    <Field label="Primer Apellido" name="cliente_b2c_primer_apellido" value={form.cliente_b2c_primer_apellido} onChange={handleChange} required />
                    <Field label="Segundo Apellido" name="cliente_b2c_segundo_apellido" value={form.cliente_b2c_segundo_apellido} onChange={handleChange} />
                  </div>
                  <Section>Contacto</Section>
                  <div style={S.grid2}>
                    <Field label="Teléfono" name="cliente_b2c_telefono_contacto" value={form.cliente_b2c_telefono_contacto} onChange={handleChange} required />
                    <Field label="Teléfono Adicional" name="cliente_b2c_telefono_contacto_adicional" value={form.cliente_b2c_telefono_contacto_adicional} onChange={handleChange} />
                  </div>
                  <Field label="Correo Electrónico" name="correo" type="email" value={form.correo} onChange={handleChange} required />
                </>
              )}

              {tipoCliente === "B2B" && (
                <>
                  <div style={S.grid2}>
                    <Field label="RUT Empresa" name="rut_cliente" value={form.rut_cliente} onChange={handleChange} required disabled={!!editingCliente} style={{ gridColumn: "1 / -1" }} />
                  </div>
                  <Field label="Razón Social" name="cliente_b2b_razon_social" value={form.cliente_b2b_razon_social} onChange={handleChange} required />
                  <Section>Contacto Empresa</Section>
                  <Field label="Correo Institucional" name="cliente_b2b_correo_institucional" type="email" value={form.cliente_b2b_correo_institucional} onChange={handleChange} required />
                  <div style={S.grid2}>
                    <Field label="Teléfono Corporativo" name="cliente_b2b_telefono_corporativo" value={form.cliente_b2b_telefono_corporativo} onChange={handleChange} required />
                    <Field label="Teléfono Adicional" name="cliente_b2b_telefono_corp_adicional" value={form.cliente_b2b_telefono_corp_adicional} onChange={handleChange} />
                  </div>
                  <Section>Representante Legal</Section>
                  <div style={S.grid2}>
                    <Field label="Primer Nombre" name="cliente_b2b_representante_legal_primer_nombre" value={form.cliente_b2b_representante_legal_primer_nombre} onChange={handleChange} required />
                    <Field label="Segundo Nombre" name="cliente_b2b_representante_legal_segundo_nombre" value={form.cliente_b2b_representante_legal_segundo_nombre} onChange={handleChange} />
                    <Field label="Primer Apellido" name="cliente_b2b_representante_legal_primer_apellido" value={form.cliente_b2b_representante_legal_primer_apellido} onChange={handleChange} required />
                    <Field label="Segundo Apellido" name="cliente_b2b_representante_legal_segundo_apellido" value={form.cliente_b2b_representante_legal_segundo_apellido} onChange={handleChange} />
                  </div>
                </>
              )}

              <div style={S.modalFooter}>
                <button type="button" style={S.btnCancel}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancelar
                </button>
                <button type="submit" style={S.btnSave}
                  onMouseEnter={e => e.currentTarget.style.background = C.accentHov}
                  onMouseLeave={e => e.currentTarget.style.background = C.accent}>
                  {editingCliente ? "Actualizar Registro" : "Guardar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
