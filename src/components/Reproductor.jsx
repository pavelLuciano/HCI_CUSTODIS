// src/components/Reproductor.jsx
// Reproductor integrado — funcionalidad core según C2 (88% no descarga sin escuchar).
// Usa el elemento <audio> nativo y dibuja una waveform decorativa.
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import "../styles/reproductor.css";

// Genera barras de waveform pseudo-aleatorias pero estables por id
function generarBarras(semilla, cantidad) {
  const barras = [];
  let x = semilla * 9301 + 49297;
  for (let i = 0; i < cantidad; i++) {
    x = (x * 9301 + 49297) % 233280;
    barras.push(20 + (x / 233280) * 80); // alto entre 20% y 100%
  }
  return barras;
}

function formatoTiempo(seg) {
  if (!seg || isNaN(seg)) return "0:00";
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Reproductor({ src, duracionSeg = 0, semilla = 1, variante = "completo" }) {
  const audioRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [actual, setActual] = useState(0);
  const [total, setTotal] = useState(duracionSeg);

  const cantidadBarras = variante === "compacto" ? 70 : 40;
  const barras = generarBarras(semilla, cantidadBarras);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setActual(audio.currentTime);
    const onMeta = () => setTotal(audio.duration || duracionSeg);
    const onEnd = () => setReproduciendo(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [duracionSeg]);

  function alternar() {
    const audio = audioRef.current;
    if (!audio) return;
    if (reproduciendo) {
      audio.pause();
    } else {
      // El audio mock puede no existir todavía; controlamos el error en silencio.
      audio.play().catch(() => {});
    }
    setReproduciendo(!reproduciendo);
  }

  const progreso = total ? (actual / total) * 100 : 0;
  const barrasActivas = Math.floor((progreso / 100) * cantidadBarras);

  return (
    <div className={`reproductor reproductor-${variante}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        className="repro-play"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar" : "Reproducir"}
      >
        {reproduciendo ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
      </button>

      <div className="repro-cuerpo">
        {variante === "completo" && (
          <>
            <div className="repro-barra-progreso">
              <div className="repro-barra-relleno" style={{ width: `${progreso}%` }} />
            </div>
            <div className="repro-tiempos">
              <span>{formatoTiempo(actual)}</span>
              <span>{formatoTiempo(total)}</span>
            </div>
          </>
        )}

        <div className="repro-waveform" aria-hidden="true">
          {barras.map((alto, i) => (
            <span
              key={i}
              className={`repro-barra ${i <= barrasActivas ? "activa" : ""}`}
              style={{ height: `${alto}%` }}
            />
          ))}
        </div>
      </div>

      {variante === "completo" && (
        <button className="repro-volumen" aria-label="Volumen">
          <Volume2 size={20} />
        </button>
      )}
    </div>
  );
}
