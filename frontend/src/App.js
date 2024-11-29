import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import ProductManagement from './components/ProductManagement';
import SalesManagement from './components/SalesManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JS de Bootstrap

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/reportes" element={<div>Reportes (próximamente)</div>} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/products" element={<ProductManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;