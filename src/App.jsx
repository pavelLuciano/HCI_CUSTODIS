// src/App.jsx
// Define las rutas. Aquí es donde las 5 pantallas quedan "conectadas" entre sí.
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explorador from "./pages/Explorador";
import Detalle from "./pages/Detalle";
import Carga from "./pages/Carga";
import Permisos from "./pages/Permisos";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explorador />} />
        <Route path="/grabacion/:id" element={<Detalle />} />
        {/* Rutas de administrador */}
        <Route path="/admin/carga" element={<Carga />} />
        <Route path="/admin/permisos" element={<Permisos />} />
        {/* Colecciones aún no implementada: reutiliza el explorador por ahora */}
        <Route path="/colecciones" element={<Explorador />} />
        {/* 404 simple */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
