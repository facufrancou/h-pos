import React, { useState } from 'react';

function InitialCashModal({ show, onClose, handleConfirm }) {
  const [initialCash, setInitialCash] = useState('');
  const [operator, setOperator] = useState('');

  const confirmInitialCash = () => {
    if (!initialCash || !operator) {
      alert('Por favor, ingrese todos los campos.');
      return;
    }
    handleConfirm({ initialCash, operator });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Registrar Fondo de Caja</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Monto inicial"
              value={initialCash}
              onChange={(e) => setInitialCash(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Operador"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={confirmInitialCash}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialCashModal;
