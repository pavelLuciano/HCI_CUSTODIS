// src/mock/data.js
// "Base de datos" falsa. Cada objeto imita un registro de la BD real de Custodis.
// Reemplaza las URLs de audio por archivos reales en /public/audio (bájalos de Freesound/Xeno-canto).

export const grabaciones = [
  {
    id: 1,
    nombre: "Amanecer en Humedal Angachilla",
    especie: "Pato cortacorrientes",
    ecosistema: "Humedal",
    region: "Los Ríos",
    fecha_captura: "2025-09-14T06:12:00",
    dispositivo: "AudioMoth 1.2",
    proyecto: "Inspección Humedales Valdivia",
    licencia: "Uso permitido con atribución al proyecto y al autor",
    geolocalizacion: { lat: -39.8489, lng: -73.2311 },
    duracion_seg: 47,
    tamano_bytes: 8200000,
    formatos: ["MP3", "WAV", "FLAC"],
    permiso: "publico", // publico | registrado | investigador
    audioUrl: "/audio/humedal-angachilla.mp3",
  },
  {
    id: 2,
    nombre: "Coro de ranas nocturno",
    especie: "Sapo de rulo",
    ecosistema: "Humedal",
    region: "Los Ríos",
    fecha_captura: "2025-10-02T21:40:00",
    dispositivo: "Zoom H5",
    proyecto: "Inspección Humedales Valdivia",
    licencia: "Solo escucha. Descarga requiere cuenta de investigador",
    geolocalizacion: { lat: -39.8021, lng: -73.2456 },
    duracion_seg: 63,
    tamano_bytes: 11500000,
    formatos: ["MP3", "WAV"],
    permiso: "registrado",
    audioUrl: "/audio/ranas-nocturno.mp3",
  },
  // ...agrega más para que el Explorador y los filtros tengan contenido suficiente
];

export const niveles_permiso = [
  { id: "publico", label: "Público", descripcion: "Cualquiera puede escuchar. Sin descarga." },
  { id: "registrado", label: "Registrado", descripcion: "Usuarios con cuenta pueden escuchar y descargar." },
  { id: "investigador", label: "Investigador", descripcion: "Acceso completo a formatos de alta calidad (WAV, FLAC)." },
  { id: "admin", label: "Administrador", descripcion: "Gestiona archivos, metadatos y permisos." },
];
