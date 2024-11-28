import React, { useState } from 'react';

function CustomProductModal({ show, onClose, onAddCustomProduct }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!description || !amount || amount <= 0) {
      alert('Por favor, ingrese una descripción válida y un monto mayor a 0.');
      return;
    }
    onAddCustomProduct({ id: '000', name: description, total: parseFloat(amount), quantity: 1 });
    setDescription('');
    setAmount('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Agregar Producto Personalizado</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Descripción del Producto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Monto Total"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleAdd}>
              Agregar
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

export default CustomProductModal;
