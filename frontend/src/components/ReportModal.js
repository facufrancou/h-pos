import React from 'react';

function ReportModal({ onClose }) {
  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/daily');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reporte_diario.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert('Reporte descargado exitosamente');
    } catch (error) {
      console.error('Error descargando el reporte:', error);
      alert('Error al descargar el reporte');
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Descargar Reporte Diario</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>¿Deseas descargar el reporte diario en formato PDF?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleDownload}>
              Descargar
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
