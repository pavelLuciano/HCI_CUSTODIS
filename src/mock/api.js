// src/mock/api.js
// "Backend" simulado. Cada función devuelve una Promise con un pequeño retraso
// para imitar la latencia de una red real. Así puedes mostrar estados de carga
// (spinners, skeletons) — refuerza el RNF7 (retroalimentación) de tu C3.

import {
  grabaciones,
  niveles_permiso,
  categorias,
  colecciones,
  proyectos,
} from "./data";

const latencia = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// GET todas las grabaciones (opcionalmente filtradas)
export async function getGrabaciones(filtros = {}) {
  await latencia();
  let resultado = [...grabaciones];

  if (filtros.region) resultado = resultado.filter((g) => g.region === filtros.region);
  if (filtros.ecosistema) resultado = resultado.filter((g) => g.ecosistema === filtros.ecosistema);
  if (filtros.especie) {
    const q = filtros.especie.toLowerCase();
    resultado = resultado.filter((g) => g.especie.toLowerCase().includes(q));
  }
  if (filtros.busqueda) {
    const q = filtros.busqueda.toLowerCase();
    resultado = resultado.filter(
      (g) => g.nombre.toLowerCase().includes(q) || g.especie.toLowerCase().includes(q)
    );
  }
  return resultado;
}

// GET una grabación por id
export async function getGrabacion(id) {
  await latencia(400);
  const g = grabaciones.find((x) => x.id === Number(id));
  if (!g) throw new Error("Grabación no encontrada");
  return g;
}

// POST simular subida de archivo (no guarda nada real, solo confirma)
export async function subirGrabacion(datos) {
  await latencia(1200); // subir tarda más
  if (!datos.titulo) {
    throw new Error("Falta el título de la grabación. Complétalo para poder publicar.");
  }
  if (!datos.fecha_captura) {
    throw new Error("Falta la fecha de captura. Complétala para poder publicar.");
  }
  return { ok: true, mensaje: "Grabación publicada correctamente." };
}

// GET niveles de permiso
export async function getNivelesPermiso() {
  await latencia(200);
  return niveles_permiso;
}

// GET datos del home
export async function getHome() {
  await latencia(300);
  return { categorias, colecciones };
}

// GET proyectos (gestión de permisos)
export async function getProyectos() {
  await latencia(400);
  return [...proyectos];
}

// PUT cambiar permiso de un proyecto (simulado)
export async function guardarPermisoProyecto(idProyecto, nuevoPermiso) {
  await latencia(700);
  return { ok: true, mensaje: "Cambios guardados correctamente." };
}
