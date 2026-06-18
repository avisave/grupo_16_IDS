import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "15px",
  marginTop: "6px",
  background: "#fff",
  boxSizing: "border-box",
};

const EditarTerminacionesMetalmecanica = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [terminaciones, setTerminaciones] = useState({
    herrajes: "", enchape: "", molduras: "", bisagras: "",
    marco_metalico: true, pletina: "", funda: "",
    medida_final: "", manilla: "", rebaje: "", canterias: "",
  });

  const [metalmecanica, setMetalmecanica] = useState({
    bastidor: "", cerradura: "", manillon: "", pernos_fijos: "",
    manilla: "", herraje: "", cerrojo: "", ojo: "", otros: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTerm, resMetal] = await Promise.all([
          fetch(`http://localhost:3000/api/terminaciones/${id}`),
          fetch(`http://localhost:3000/api/metalmecanica/${id}`),
        ]);

        if (resTerm.ok) {
          const data = await resTerm.json();
          setTerminaciones({
            herrajes: data.terminaciones.herrajes || "",
            enchape: data.terminaciones.enchape || "",
            molduras: data.terminaciones.molduras || "",
            bisagras: data.terminaciones.bisagras || "",
            marco_metalico: !!data.terminaciones.marco_metalico,
            pletina: data.terminaciones.pletina ?? "",
            funda: data.terminaciones.funda ?? "",
            medida_final: data.terminaciones.medida_final ?? "",
            manilla: data.terminaciones.manilla ?? "",
            rebaje: data.terminaciones.rebaje || "",
            canterias: data.terminaciones.canterias || "",
          });
        }

        if (resMetal.ok) {
          const data = await resMetal.json();
          setMetalmecanica({
            bastidor: data.metalmecanica.bastidor || "",
            cerradura: data.metalmecanica.cerradura || "",
            manillon: data.metalmecanica.manillon || "",
            pernos_fijos: data.metalmecanica.pernos_fijos || "",
            manilla: data.metalmecanica.manilla || "",
            herraje: data.metalmecanica.herraje || "",
            cerrojo: data.metalmecanica.cerrojo || "",
            ojo: data.metalmecanica.ojo || "",
            otros: data.metalmecanica.otros || "",
          });
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleTerminacionesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTerminaciones(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMetalmecanicaChange = (e) => {
    const { name, value } = e.target;
    setMetalmecanica(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const [resTerm, resMetal] = await Promise.all([
        fetch(`http://localhost:3000/api/terminaciones/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(terminaciones),
        }),
        fetch(`http://localhost:3000/api/metalmecanica/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metalmecanica),
        }),
      ]);

      if (!resTerm.ok) {
        const errData = await resTerm.json();
        throw new Error(errData.msg || "Error al guardar terminaciones");
      }
      if (!resMetal.ok) {
        const errData = await resMetal.json();
        throw new Error(errData.msg || "Error al guardar metalmecánica");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Cargando datos...</div>;
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>
            Editar Terminaciones y Metalmecánica
          </h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            Especificación de Puerta ID: <strong>{id}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            background: "#e2e8f0",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Volver
        </button>
      </div>

      {success && (
        <div style={{
          background: "#d1fae5", color: "#065f46", padding: "12px 20px",
          borderRadius: "8px", marginBottom: "20px", fontWeight: "600"
        }}>
          Cambios guardados correctamente
        </div>
      )}

      {error && (
        <div style={{
          background: "#fee2e2", color: "#dc2626", padding: "12px 20px",
          borderRadius: "8px", marginBottom: "20px", fontWeight: "600"
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

        <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: "0 0 20px 0", color: "#ea580c", fontSize: "20px", borderBottom: "2px solid #fed7aa", paddingBottom: "8px" }}>
            Terminaciones
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <label>Medida Final<br/>
              <input type="text" name="medida_final" value={terminaciones.medida_final} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Enchape<br/>
              <input type="text" name="enchape" value={terminaciones.enchape} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Herrajes<br/>
              <input type="text" name="herrajes" value={terminaciones.herrajes} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Bisagras<br/>
              <input type="text" name="bisagras" value={terminaciones.bisagras} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Molduras<br/>
              <input type="text" name="molduras" value={terminaciones.molduras} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Rebaje<br/>
              <input type="text" name="rebaje" value={terminaciones.rebaje} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Canterías<br/>
              <input type="text" name="canterias" value={terminaciones.canterias} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>
              <input type="checkbox" name="marco_metalico" checked={terminaciones.marco_metalico} onChange={handleTerminacionesChange} />
              {" "} Marco Metálico
            </label>
            <label>Pletina (mm)<br/>
              <input type="number" name="pletina" value={terminaciones.pletina} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
            <label>Funda (mm)<br/>
              <input type="number" name="funda" value={terminaciones.funda} onChange={handleTerminacionesChange} style={inputStyle} />
            </label>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: "0 0 20px 0", color: "#ea580c", fontSize: "20px", borderBottom: "2px solid #fed7aa", paddingBottom: "8px" }}>
            Metalmecánica
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <label>Bastidor<br/>
              <input type="text" name="bastidor" value={metalmecanica.bastidor} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Cerradura<br/>
              <input type="text" name="cerradura" value={metalmecanica.cerradura} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Manillón<br/>
              <input type="text" name="manillon" value={metalmecanica.manillon} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Pernos Fijos<br/>
              <input type="text" name="pernos_fijos" value={metalmecanica.pernos_fijos} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Manilla<br/>
              <input type="text" name="manilla" value={metalmecanica.manilla} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Herraje<br/>
              <input type="text" name="herraje" value={metalmecanica.herraje} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Cerrojo<br/>
              <input type="text" name="cerrojo" value={metalmecanica.cerrojo} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Ojo<br/>
              <input type="text" name="ojo" value={metalmecanica.ojo} onChange={handleMetalmecanicaChange} style={inputStyle} />
            </label>
            <label>Otros<br/>
              <textarea name="otros" value={metalmecanica.otros} onChange={handleMetalmecanicaChange}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? "#9ca3af" : "#ea580c",
            color: "white",
            border: "none",
            padding: "14px 40px",
            fontSize: "16px",
            fontWeight: "700",
            borderRadius: "10px",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
            transition: "all 0.2s",
          }}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default EditarTerminacionesMetalmecanica;
