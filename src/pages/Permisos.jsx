// src/pages/Permisos.jsx
// Pantalla 5 — Gestión de permisos (admin). Control de acceso en lenguaje no técnico (Hallazgo 4).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Plus } from "lucide-react";
import { getProyectos, guardarPermisoProyecto } from "../mock/api";
import { niveles_permiso } from "../mock/data";
import "../styles/permisos.css";

// Niveles que se ofrecen en el selector (sin "admin", que no se asigna a un proyecto)
const opciones = niveles_permiso.filter((n) => n.id !== "admin");

export default function Permisos() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    getProyectos().then((p) => {
      setProyectos(p);
      setCargando(false);
    });
  }, []);

  function cambiarNivel(idProyecto, nuevo) {
    setProyectos((prev) =>
      prev.map((p) => (p.id === idProyecto ? { ...p, permiso: nuevo } : p))
    );
  }

  async function guardar(idProyecto) {
    const proy = proyectos.find((p) => p.id === idProyecto);
    const res = await guardarPermisoProyecto(idProyecto, proy.permiso);
    const label = opciones.find((o) => o.id === proy.permiso)?.label ?? "";
    setAviso(`Listo. Ahora "${proy.nombre}" está disponible para: ${label}.`);
    setTimeout(() => setAviso(""), 4000);
  }

  function descripcionDe(permisoId) {
    return opciones.find((o) => o.id === permisoId)?.descripcion ?? "";
  }

  return (
    <div className="contenedor permisos">
      <button className="btn-fantasma permisos-volver" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Regresar
      </button>

      <div className="permisos-head">
        <div>
          <h1><Users size={26} /> Gestión de permisos</h1>
          <p>Controla quién puede acceder a tus proyectos</p>
        </div>
        <button className="btn btn-primario"><Plus size={18} /> Nuevo proyecto</button>
      </div>

      {aviso && <div className="permisos-aviso">{aviso}</div>}

      {cargando ? (
        <div className="cargando"><span className="spinner" /> Cargando proyectos…</div>
      ) : (
        <div className="permisos-tabla tarjeta">
          <div className="permisos-fila permisos-cabecera">
            <span>Proyecto / Grabación</span>
            <span>Archivos</span>
            <span>Nivel de acceso</span>
            <span>Acciones</span>
          </div>

          {proyectos.map((p) => (
            <div key={p.id} className="permisos-fila">
              <div className="permisos-proyecto">
                <strong>{p.nombre}</strong>
                <span>creado el {p.creado}</span>
              </div>
              <span className="permisos-archivos">{p.archivos} archivos</span>
              <div className="permisos-nivel">
                <select
                  value={p.permiso}
                  onChange={(e) => cambiarNivel(p.id, e.target.value)}
                >
                  {opciones.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <p className="permisos-desc">{descripcionDe(p.permiso)}</p>
              </div>
              <button className="btn-fantasma" onClick={() => guardar(p.id)}>
                Guardar cambios
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
