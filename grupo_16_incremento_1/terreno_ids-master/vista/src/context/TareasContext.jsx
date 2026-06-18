import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const TareasContext = createContext();

const API = "http://localhost:3000/api/tareas";

const mapearTarea = (t) => ({
  id: t.id_tarea,
  codigo: `TS-${1000 + t.id_tarea}`,
  titulo: t.titulo,
  descripcion: t.descripcion,
  estado: t.estado_de_tarea,
  urgencia: t.urgencia,
  visita: t.fecha_de_visita || "—",
  termino: t.fecha_de_termino || "—",
  tecnicos: Array.isArray(t.tecnicos) ? t.tecnicos.map(u => u.id_usuario) : [],
  ultimaModif: t.fecha_de_ultima_actualizacion || "—",
  historial: []
});

const headers = () => {
  const h = { "Content-Type": "application/json" };
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) h["x-user-id"] = user.id;
  } catch {}
  return h;
};

export const TareasProvider = ({ children }) => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTareas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      if (data.ok) {
        setTareas((data.tareas || []).map(mapearTarea));
      }
    } catch (error) {
      console.error("Error fetching tareas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTareas(); }, [fetchTareas]);

  const actualizarTarea = async (id, camposActualizados, accionDetalle, notaCambio) => {
    const body = {
      titulo: camposActualizados.titulo,
      descripcion: camposActualizados.descripcion,
      estado_de_tarea: camposActualizados.estado,
      urgencia: camposActualizados.urgencia,
      fecha_de_visita: camposActualizados.visita || null,
      fecha_de_termino: camposActualizados.termino || null,
      tecnicos: camposActualizados.tecnicos
    };
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.solicitud_creada) {
        alert(data.msg);
      } else if (data.ok) {
        await fetchTareas();
      } else {
        alert(data.msg || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const crearTarea = async (nuevaTarea) => {
    const body = {
      titulo: nuevaTarea.titulo,
      descripcion: nuevaTarea.descripcion || "",
      estado_de_tarea: nuevaTarea.estado || "pendiente",
      urgencia: nuevaTarea.urgencia || "media",
      fecha_de_visita: nuevaTarea.visita || null,
      fecha_de_termino: nuevaTarea.termino || null,
      tecnicos: nuevaTarea.tecnicos || []
    };
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.solicitud_creada) {
        alert(data.msg);
      } else if (data.ok) {
        await fetchTareas();
      } else {
        alert(data.msg || "Error al crear");
      }
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  return (
    <TareasContext.Provider value={{ tareas, loading, actualizarTarea, crearTarea }}>
      {children}
    </TareasContext.Provider>
  );
};
