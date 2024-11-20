import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SalesByDate from './components/SalesByDate';
import Config from './components/Config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JS de Bootstrap

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales-by-date" element={<SalesByDate />} />
          {/* Aquí puedes agregar más rutas en el futuro */}
          <Route path="/reportes" element={<div>Reportes (próximamente)</div>} />
          {/* <Route path="/configuracion" element={<div>Configuración (próximamente)</div>} /> */}
          <Route path="/configuracion" element={<Config />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;