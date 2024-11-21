import React, { useState } from 'react';

function WithdrawalModal({ show, onClose, handleConfirm }) {
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('');

  const confirmWithdrawal = () => {
    if (!amount || !operator) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    handleConfirm({ amount, operator });
    setAmount(''); // Limpiar campo de monto
    setOperator(''); // Limpiar campo de operador
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Registrar Retiro</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Monto del retiro"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            <button className="btn btn-primary" onClick={confirmWithdrawal}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalModal;
