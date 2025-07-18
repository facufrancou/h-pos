import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/");
  
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
  
  const isActive = (path) => {
    return activeLink === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-cash-register me-2"></i>
          Punto360
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
              <Link className="nav-link" to="/">
                <i className="fas fa-tachometer-alt me-1"></i> Dashboard
              </Link>
            </li>
            <li className={`nav-item ${isActive("/sales") ? "active" : ""}`}>
              <Link className="nav-link" to="/sales">
                <i className="fas fa-chart-line me-1"></i> Reportes
              </Link>
            </li>
            <li className={`nav-item ${isActive("/clients") ? "active" : ""}`}>
              <Link className="nav-link" to="/clients">
                <i className="fas fa-users me-1"></i> Clientes
              </Link>
            </li>
            <li className={`nav-item ${isActive("/products") ? "active" : ""}`}>
              <Link className="nav-link" to="/products">
                <i className="fas fa-box me-1"></i> Productos
              </Link>
            </li>
          </ul>
          
          <div className="ms-auto d-flex align-items-center">
            <div className="text-white me-3">
              <span id="current-date-time"></span>
            </div>
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-user-circle me-1"></i> Usuario
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><button className="dropdown-item" type="button"><i className="fas fa-cog me-2"></i>Configuración</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" type="button"><i className="fas fa-sign-out-alt me-2"></i>Cerrar sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
