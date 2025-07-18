import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import ProductManagement from './components/ProductManagement';
import SalesManagement from './components/SalesManagement';
import ToastContainer from './components/ToastContainer';
import { initializeDateTimeDisplay } from './utils/dateTimeUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JS de Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/pos-theme.css'; // Custom POS theme styles

function App() {
  useEffect(() => {
    // Initialize the date/time display in the navbar
    initializeDateTimeDisplay();
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="container mt-4 animate-fadeIn">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/reportes" element={<div>Reportes (próximamente)</div>} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/products" element={<ProductManagement />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;