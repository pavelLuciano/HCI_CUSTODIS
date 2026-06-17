// src/pages/Explorador.jsx
// Pantalla 2 — Explorador. Filtros contextuales (RF2) + resultados con mini-reproductor.
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Mic, MapPin, Calendar, Clock } from "lucide-react";
import { getGrabaciones } from "../mock/api";
import { regiones, ecosistemas } from "../mock/data";
import Reproductor from "../components/Reproductor";
import "../styles/explorador.css";

function formatoFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}
function formatoDuracion(seg) {
  const m = Math.floor(seg / 60);
  const s = (seg % 60).toString().padStart(2, "0");
  return `${m}:${s} min`;
}
function formatoMB(bytes) {
  return `${(bytes / 1_000_000).toFixed(1)}MB`;
}

export default function Explorador() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qInicial = searchParams.get("q") || "";

  const [busqueda, setBusqueda] = useState(qInicial);
  const [region, setRegion] = useState("");
  const [ecosistemasSel, setEcosistemasSel] = useState([]);
  const [especie, setEspecie] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Carga inicial / cuando cambia la búsqueda del header
  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleEcosistema(eco) {
    setEcosistemasSel((prev) =>
      prev.includes(eco) ? prev.filter((e) => e !== eco) : [...prev, eco]
    );
  }

  async function aplicarFiltros(e) {
    if (e) e.preventDefault();
    setCargando(true);
    const filtros = { busqueda, region, especie };
    // Para varios ecosistemas: filtramos en cliente tras traer por región/búsqueda
    let data = await getGrabaciones(filtros);
    if (ecosistemasSel.length > 0) {
      data = data.filter((g) => ecosistemasSel.includes(g.ecosistema));
    }
    setResultados(data);
    setCargando(false);
  }

  return (
    <div className="explorador contenedor">
      {/* Buscador superior */}
      <form className="exp-buscador" onSubmit={aplicarFiltros} role="search">
        <Search size={18} className="exp-buscador-icono" />
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar grabaciones"
        />
        <button type="button" className="exp-mic" aria-label="Búsqueda por voz">
          <Mic size={18} />
        </button>
      </form>

      <div className="exp-layout">
        {/* Barra lateral de filtros */}
        <aside className="exp-filtros tarjeta" aria-label="Filtros">
          <h2 className="exp-filtros-titulo">Filtros</h2>

          <label className="exp-campo">
            <span>Región</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Todas</option>
              {regiones.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <fieldset className="exp-campo">
            <legend>Ecosistema</legend>
            {ecosistemas.map((eco) => (
              <label key={eco} className="exp-check">
                <input
                  type="checkbox"
                  checked={ecosistemasSel.includes(eco)}
                  onChange={() => toggleEcosistema(eco)}
                />
                {eco}
              </label>
            ))}
          </fieldset>

          <label className="exp-campo">
            <span>Especie</span>
            <input
              type="text"
              placeholder="Ej: Traro, Hued-Hued"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            />
          </label>

          <label className="exp-campo">
            <span>Rango de fechas</span>
            <input type="date" />
          </label>
          <label className="exp-campo">
            <input type="date" />
          </label>

          <button className="btn btn-primario exp-aplicar" onClick={aplicarFiltros}>
            Aplicar Filtros
          </button>
        </aside>

        {/* Resultados */}
        <section className="exp-resultados">
          <div className="exp-resultados-head">
            <h2>{cargando ? "Buscando…" : `${resultados.length} resultados encontrados`}</h2>
            <label className="exp-ordenar">
              Ordenar por:
              <select>
                <option>Relevancia</option>
                <option>Más recientes</option>
                <option>Duración</option>
              </select>
            </label>
          </div>

          {cargando ? (
            <div className="cargando"><span className="spinner" /> Cargando grabaciones…</div>
          ) : resultados.length === 0 ? (
            <div className="exp-vacio tarjeta">
              No encontramos grabaciones con esos filtros. Prueba ampliar la zona o quitar alguno.
            </div>
          ) : (
            resultados.map((g) => (
              <article
                key={g.id}
                className="exp-card tarjeta"
                onClick={() => navigate(`/grabacion/${g.id}`)}
              >
                <div className="exp-card-head">
                  <h3>{g.nombre}</h3>
                  <span className="etiqueta-formato">
                    {g.formatos[0]} · {formatoMB(g.tamano_bytes)}
                  </span>
                </div>
                <div className="exp-card-meta">
                  <span><MapPin size={14} /> {g.lugar}</span>
                  <span><Calendar size={14} /> {formatoFecha(g.fecha_captura)}</span>
                  <span><Clock size={14} /> {formatoDuracion(g.duracion_seg)}</span>
                </div>
                {/* Detenemos la propagación para que tocar el play no navegue */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Reproductor
                    src={g.audioUrl}
                    duracionSeg={g.duracion_seg}
                    semilla={g.id}
                    variante="compacto"
                  />
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
