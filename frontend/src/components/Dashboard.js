import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SalesModal from './SalesModal';

function Dashboard() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false); // Modal para fondo
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false); // Modal para retiro
  const [fundAmount, setFundAmount] = useState(''); // Monto para fondo
  const [fundDescription, setFundDescription] = useState(''); // Descripción de fondo
  const [withdrawalAmount, setWithdrawalAmount] = useState(''); // Monto para retiro
  const [withdrawalDescription, setWithdrawalDescription] = useState(''); // Descripción de retiro

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('Products fetched:', response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFundSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/funds', {
        fecha: new Date().toISOString(),
        descripcion: fundDescription,
        monto: parseFloat(fundAmount),
      });
      alert('Fondo ingresado correctamente');
      setShowFundModal(false);
      setFundAmount('');
      setFundDescription('');
    } catch (error) {
      console.error('Error al ingresar fondo:', error);
      alert('Error al ingresar fondo');
    }
  };

  const handleWithdrawalSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/withdrawals', {
        fecha: new Date().toISOString(),
        descripcion: withdrawalDescription,
        monto: parseFloat(withdrawalAmount),
      });
      alert('Retiro ingresado correctamente');
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      setWithdrawalDescription('');
    } catch (error) {
      console.error('Error al ingresar retiro:', error);
      alert('Error al ingresar retiro');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <div className="mb-3">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowSalesModal(true)}
        >
          Nueva Venta
        </button>
        <button
          className="btn btn-success mb-3 ms-2"
          onClick={() => setShowFundModal(true)}
        >
          Ingresar Fondo de Caja
        </button>
        <button
          className="btn btn-warning mb-3 ms-2"
          onClick={() => setShowWithdrawalModal(true)}
        >
          Ingresar Retiro
        </button>
      </div>

      {/* Modales */}
      {showFundModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Ingresar Fondo de Caja</h5>
                <button className="btn-close" onClick={() => setShowFundModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Monto"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
                <textarea
                  className="form-control"
                  placeholder="Descripción"
                  value={fundDescription}
                  onChange={(e) => setFundDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleFundSubmit}>
                  Registrar Fondo
                </button>
                <button className="btn btn-secondary" onClick={() => setShowFundModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWithdrawalModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Ingresar Retiro</h5>
                <button className="btn-close" onClick={() => setShowWithdrawalModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Monto"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
                <textarea
                  className="form-control"
                  placeholder="Descripción"
                  value={withdrawalDescription}
                  onChange={(e) => setWithdrawalDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleWithdrawalSubmit}>
                  Registrar Retiro
                </button>
                <button className="btn btn-secondary" onClick={() => setShowWithdrawalModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SalesModal
        show={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </div>
  );
}

export default Dashboard;
