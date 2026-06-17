// src/pages/Carga.jsx
// Pantalla 4 — Panel de carga (admin). Drag & drop + metadatos + permiso, con feedback (RNF7).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FilePlus } from "lucide-react";
import { subirGrabacion } from "../mock/api";
import "../styles/carga.css";

export default function Carga() {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    especie: "",
    fecha_captura: "",
    coordenadas: "",
    dispositivo: "",
    permiso: "publico",
  });
  const [estado, setEstado] = useState({ tipo: "idle", mensaje: "" });

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onDrop(e) {
    e.preventDefault();
    setArrastrando(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setArchivo(f.name);
  }

  function onSeleccion(e) {
    const f = e.target.files?.[0];
    if (f) setArchivo(f.name);
  }

  async function publicar() {
    setEstado({ tipo: "enviando", mensaje: "" });
    try {
      const res = await subirGrabacion(form);
      setEstado({ tipo: "ok", mensaje: res.mensaje });
    } catch (err) {
      setEstado({ tipo: "error", mensaje: err.message });
    }
  }

  return (
    <div className="contenedor carga">
      <button className="btn-fantasma carga-volver" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Regresar
      </button>

      <div className="carga-card tarjeta">
        {/* Zona drag & drop */}
        <div
          className={`carga-drop ${arrastrando ? "activo" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={onDrop}
        >
          <FilePlus size={32} className="carga-drop-icono" />
          <h2>{archivo ? archivo : "Arrastra y suelta tus archivos de audio hasta aquí"}</h2>
          <p>o haz clic para seleccionar archivos (WAV, FLAC, MP3)</p>
          <label className="btn btn-secundario carga-seleccionar">
            Seleccionar Archivo
            <input type="file" accept=".wav,.flac,.mp3" hidden onChange={onSeleccion} />
          </label>
        </div>

        <hr className="carga-divisor" />

        {/* Metadatos */}
        <h3 className="carga-seccion">Metadatos obligatorios</h3>

        <label className="carga-campo carga-campo-ancho">
          <span>Título de la grabación</span>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => actualizar("titulo", e.target.value)}
          />
        </label>

        <div className="carga-grid">
          <label className="carga-campo">
            <span>Especie (si se conoce)</span>
            <input type="text" value={form.especie} onChange={(e) => actualizar("especie", e.target.value)} />
          </label>
          <label className="carga-campo">
            <span>Fecha de captura</span>
            <input type="date" value={form.fecha_captura} onChange={(e) => actualizar("fecha_captura", e.target.value)} />
          </label>
          <label className="carga-campo">
            <span>Coordenadas</span>
            <input type="text" placeholder="-39.79, -73.24" value={form.coordenadas} onChange={(e) => actualizar("coordenadas", e.target.value)} />
          </label>
          <label className="carga-campo">
            <span>Dispositivo de captura</span>
            <input type="text" value={form.dispositivo} onChange={(e) => actualizar("dispositivo", e.target.value)} />
          </label>
        </div>

        <hr className="carga-divisor" />

        {/* Nivel de acceso */}
        <h3 className="carga-seccion">Nivel de acceso</h3>
        <label className={`carga-radio ${form.permiso === "publico" ? "sel" : ""}`}>
          <input
            type="radio"
            name="permiso"
            checked={form.permiso === "publico"}
            onChange={() => actualizar("permiso", "publico")}
          />
          <div>
            <strong>Público (solo escucha)</strong>
            <p>Cualquier visitante puede escuchar, pero no descargar.</p>
          </div>
        </label>
        <label className={`carga-radio ${form.permiso === "investigador" ? "sel" : ""}`}>
          <input
            type="radio"
            name="permiso"
            checked={form.permiso === "investigador"}
            onChange={() => actualizar("permiso", "investigador")}
          />
          <div>
            <strong>Investigadores Registrados</strong>
            <p>Requiere inicio de sesión para descargar en alta calidad.</p>
          </div>
        </label>

        {/* Feedback (RNF7) */}
        {estado.tipo === "ok" && <div className="carga-feedback ok">{estado.mensaje}</div>}
        {estado.tipo === "error" && <div className="carga-feedback error">{estado.mensaje}</div>}

        <hr className="carga-divisor" />

        <div className="carga-acciones">
          <button className="btn btn-secundario" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primario" onClick={publicar} disabled={estado.tipo === "enviando"}>
            {estado.tipo === "enviando" ? "Publicando…" : "Publicar grabación"}
          </button>
        </div>
      </div>
    </div>
  );
}
