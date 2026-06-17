# Custodis — Prototipo de evaluación (C4)

Plataforma colaborativa de custodia y acceso a archivos digitales (grabaciones bioacústicas).
Prototipo de alta fidelidad con **backend simulado (mock)** para testing con usuarios — INFO245, UACh 2026.

> Este prototipo no usa servidor ni base de datos reales. Los datos provienen de archivos mock
> en `/src/mock` y la "API" simula latencia de red para imitar una app real.

## Stack

- **Vite + React** — build y manejo de estado de las 5 pantallas.
- **Leaflet + OpenStreetMap** — mapa de grabaciones (RF4), sin API key.
- **Lucide React** — iconografía.
- Backend simulado con `Promise` + `setTimeout` en `src/mock/api.js`.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm).
- [Git](https://git-scm.com/).

## Cómo correr el proyecto

```bash
# 1. Clonar el repo
git clone https://github.com/USUARIO/custodis.git
cd custodis

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre la URL que aparece en consola (normalmente http://localhost:5173).

## Estructura del proyecto

```
custodis/
├── public/
│   └── audio/            # archivos .mp3 de prueba (livianos)
├── src/
│   ├── mock/
│   │   ├── data.js       # grabaciones falsas (metadatos, permisos)
│   │   └── api.js        # "backend" simulado: devuelve data con latencia
│   ├── pages/            # las 5 pantallas (Home, Explorador, Detalle, Carga, Permisos)
│   ├── components/       # reproductor, filtros, tarjetas, mapa
│   └── App.jsx
├── package.json
└── README.md
```

## Pantallas (según C3)

1. **Home** — buscador, categorías, mapa, colecciones destacadas.
2. **Explorador** — filtros (región, ecosistema, especie, fecha) + resultados.
3. **Detalle** — reproductor, metadatos, mapa, licencia, descarga.
4. **Panel de carga** (admin) — drag & drop, formulario de metadatos, permisos.
5. **Gestión de permisos** (admin) — niveles Público / Registrado / Investigador / Admin.

## Flujo de trabajo en equipo (Git)

- `main` — rama estable. No trabajar directo aquí.
- Cada integrante crea su rama: `git checkout -b feature/nombre-pantalla`.
- Al terminar, abre un **Pull Request** hacia `main` para que el equipo revise.

## Integrantes

- Luciano Ambiado Ortiz
- Martín Jaque Lobos
- Nicolás Sandoval Jerez
- Benjamín Martínez Cereceda
- Jennifer Rodríguez Estrada
