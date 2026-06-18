import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <h2>Sistema Terreno</h2>

      <Link to="/">Dashboard</Link>
      <br />
      <Link to="/clientes">Clientes</Link>
    </div>
  );
}

export default Sidebar;