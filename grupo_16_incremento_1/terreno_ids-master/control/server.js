import express from "express";
import cors from "cors";

import clienteRoutes from "./routes/clienteRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import solicitudRoutes from "./routes/solicitudRoutes.js";
import obraRoutes from "./routes/obraRoutes.js";
import terminacionesRoutes from "./routes/terminacionesRoutes.js";
import metalmecanicaRoutes from "./routes/metalmecanicaRoutes.js";
import ordenTrabajoRoutes from "./routes/ordenTrabajoRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/obras", obraRoutes);
app.use("/api/terminaciones", terminacionesRoutes);
app.use("/api/metalmecanica", metalmecanicaRoutes);
app.use("/api/orden-trabajo", ordenTrabajoRoutes);

app.listen(3000, () => {
  console.log("Servidor ejecutándose");
});