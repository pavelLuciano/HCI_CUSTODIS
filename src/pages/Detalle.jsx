// src/pages/Detalle.jsx
// Pantalla 3 — Detalle. Reproductor + metadatos + mapa en una sola vista (oportunidad C2).
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Map as MapIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getGrabacion } from "../mock/api";
import Reproductor from "../components/Reproductor";
import "leaflet/dist/leaflet.css";
import "../styles/detalle.css";

// Arreglo del ícono por defecto de Leaflet en bundlers (Vite)
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

function formatoFecha(iso) {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
  const hora = d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  return `${fecha} – ${hora}`;
}

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [g, setG] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    getGrabacion(id)
      .then(setG)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return <div className="cargando"><span className="spinner" /> Cargando grabación…</div>;
  }
  if (error) {
    return (
      <div className="contenedor detalle">
        <div className="exp-vacio tarjeta">{error}</div>
      </div>
    );
  }

  const restringida = g.permiso !== "publico";

  return (
    <div className="contenedor detalle">
      <button className="detalle-volver btn-fantasma" onClick={() => navigate("/explorar")}>
        <ArrowLeft size={18} /> Regresar al explorador
      </button>

      <div className="detalle-card tarjeta">
        <div className="detalle-head">
          <div>
            <h1>{g.nombre}</h1>
            <p className="detalle-autor">Autor : {g.autor}</p>
          </div>
          <button
            className={`btn ${restringida ? "btn-secundario" : "btn-primario"}`}
            disabled={restringida}
            title={restringida ? "Inicia sesión para descargar" : "Descargar archivo"}
          >
            <Download size={18} /> Descargar
          </button>
        </div>

        <hr className="detalle-divisor" />

        <div className="detalle-cuerpo">
          {/* Columna izquierda: reproductor + mapa */}
          <div className="detalle-izq">
            <Reproductor
              src={g.audioUrl}
              duracionSeg={g.duracion_seg}
              semilla={g.id}
              variante="completo"
            />

            <h2 className="detalle-mapa-titulo">
              <MapIcon size={20} /> Ubicación de la grabación
            </h2>
            <div className="detalle-mapa">
              <MapContainer
                center={[g.geolocalizacion.lat, g.geolocalizacion.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[g.geolocalizacion.lat, g.geolocalizacion.lng]}>
                  <Popup>{g.lugar}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Columna derecha: metadatos */}
          <aside className="detalle-meta tarjeta">
            <h2 className="detalle-meta-titulo">Metadatos</h2>

            <div className="meta-item">
              <span className="meta-label">Especies Identificadas</span>
              <span className="meta-valor">{g.especie}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Fecha de captura</span>
              <span className="meta-valor">{formatoFecha(g.fecha_captura)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Dispositivo</span>
              <span className="meta-valor">{g.dispositivo}</span>
            </div>

            {restringida && (
              <div className="meta-aviso">
                <strong>Descarga restringida</strong>
                <p>
                  Inicia sesión para descargar este archivo. Los usuarios registrados
                  pueden acceder a formatos de alta calidad.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
