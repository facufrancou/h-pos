import React from 'react';

function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="pos-spinner-container">
      <div className="d-flex flex-column align-items-center">
        <div className="pos-spinner mb-3"></div>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
