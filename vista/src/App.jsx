import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Usuarios from "./pages/Usuarios";
import UsuarioForm from "./pages/UsuarioForm";
import Obras from "./pages/Obras";
import Tareas from "./pages/Tareas";
import Trazabilidad from "./pages/Trazabilidad";
import Solicitudes from "./pages/Solicitudes";
import EditarTerminacionesMetalmecanica from "./pages/EditarTerminacionesMetalmecanica";
import { TareasProvider } from "./context/TareasContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <TareasProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={null} /> 
            
            <Route path="clientes" element={<Clientes />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="usuarios/nuevo" element={<UsuarioForm />} />
            <Route path="usuarios/editar/:id" element={<UsuarioForm />} />
            <Route path="obras" element={<Obras />} />
            <Route path="tareas" element={<Tareas />} />
            <Route path="trazabilidad" element={<Trazabilidad />} />
            <Route path="solicitudes" element={<Solicitudes />} />
            <Route path="editar-terminaciones/:id" element={<EditarTerminacionesMetalmecanica />} />
          </Route>
        </Routes>
      </TareasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
