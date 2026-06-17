// src/pages/Home.jsx
// Pantalla 1 — Inicio. Resuelve el descubrimiento desde cero (hallazgo central C2).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic } from "lucide-react";
import { getHome } from "../mock/api";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    getHome().then(setDatos);
  }, []);

  function buscar(e) {
    e.preventDefault();
    // Lleva al explorador con el término de búsqueda como query param
    navigate(`/explorar?q=${encodeURIComponent(busqueda)}`);
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="contenedor">
          <h1 className="hero-titulo">Custodia y acceso a archivos bioacústicos</h1>
          <p className="hero-sub">
            Explora y escucha grabaciones de naturaleza y humedales del sur de Chile.
            Explora y escucha sin crear una cuenta.
          </p>
          <form className="hero-buscador" onSubmit={buscar} role="search">
            <Search size={18} className="hero-buscador-icono" />
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar grabaciones"
            />
            <button type="button" className="hero-mic" aria-label="Búsqueda por voz">
              <Mic size={18} />
            </button>
          </form>
        </div>
      </section>

      <div className="contenedor">
        {/* Categorías */}
        <section className="bloque">
          <h2 className="bloque-titulo">Explora por Categorías</h2>
          <div className="categorias-grid">
            {(datos?.categorias ?? []).map((c) => (
              <button
                key={c.id}
                className="categoria-card tarjeta"
                onClick={() => navigate("/explorar")}
              >
                <div className="categoria-img" />
                <div className="categoria-info">
                  <h3>{c.titulo}</h3>
                  <p>{c.subtitulo}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Colecciones destacadas */}
        <section className="bloque">
          <h2 className="bloque-titulo">Colecciones Destacadas</h2>
          <div className="colecciones-grid">
            {(datos?.colecciones ?? []).map((col) => (
              <div key={col.id} className="coleccion-card tarjeta">
                <div className="coleccion-thumb" />
                <div className="coleccion-info">
                  <h3>{col.titulo}</h3>
                  <p>{col.meta}</p>
                </div>
                <button className="btn-fantasma" onClick={() => navigate("/explorar")}>
                  Ver más
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
