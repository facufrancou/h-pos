import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SalesModal from './SalesModal';

function Dashboard() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false); // Modal para fondo
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false); // Modal para retiro
  const [showClosureModal, setShowClosureModal] = useState(false); // Modal para cierre parcial
  const [closureData, setClosureData] = useState({
    fondoInicial: 0,
    ventasEfectivo: 0,
    totalRetiros: 0,
    fondoFinal: 0,
    ventasPorMetodo: [],
    retiros: [],
    fondos: [],
  }); // Datos inicializados para evitar errores
  const [fundAmount, setFundAmount] = useState(''); // Monto para fondo
  const [fundDescription, setFundDescription] = useState(''); // Descripción de fondo
  const [withdrawalAmount, setWithdrawalAmount] = useState(''); // Monto para retiro
  const [withdrawalDescription, setWithdrawalDescription] = useState(''); // Descripción de retiro
  const paymentMethods = {
    1: "Efectivo",
    2: "Transferencia",
    3: "Tarjeta de Débito",
    4: "Tarjeta de Crédito",
    5: "App Delivery",
  };
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

  const handleGeneratePartialClosure = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/closures/partial');
      console.log('Cierre parcial generado:', response.data);
      setClosureData(response.data?.summary || closureData); // Garantiza que los datos sean válidos
      setShowClosureModal(true);
    } catch (error) {
      console.error('Error al generar el cierre parcial:', error);
      alert('Error al generar el cierre parcial');
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
        <button
          className="btn btn-info mb-3 ms-2"
          onClick={handleGeneratePartialClosure}
        >
          Generar Cierre Parcial
        </button>
      </div>

      {/* Modal de Ingreso de Fondos */}
      {showFundModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Ingresar Fondo de Caja</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowFundModal(false)}
                ></button>
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

      {/* Modal de Retiro */}
      {showWithdrawalModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Ingresar Retiro</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowWithdrawalModal(false)}
                ></button>
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

      {/* Modal de Cierre Parcial */}
      {showClosureModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Resumen de Cierre Parcial</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowClosureModal(false)}
                ></button>
              </div>
              <div className="modal-body">
              <h6>Balance</h6>
<p><strong>Fondo Inicial:</strong> ${closureData.fondoInicial}</p>
<p><strong>Total Ventas:</strong></p>
<ul>
  <li><strong>Número Total de Ventas:</strong> {closureData.totalVentasNumero || 0}</li>
  <li><strong>Monto Total de Ventas:</strong> ${closureData.totalVentasMonto || 0}</li>
</ul>
<p><strong>Total Retiros:</strong> -${closureData.totalRetiros}</p>
<p><strong>Fondo Final:</strong> ${closureData.fondoFinal}</p>

<h6>Detalle de Fondos</h6>
<ul>
  <li><strong>Fondo en Caja:</strong> ${closureData.fondoCaja || 0}</li>
  <li><strong>Fondo en Cuenta:</strong> ${closureData.fondoCuenta || 0}</li>
</ul>

<h6>Ventas por Método de Pago</h6>
<ul>
  {closureData.ventasPorMetodo.length > 0 ? (
    closureData.ventasPorMetodo.map((venta, index) => (
      <li key={index}>
        {paymentMethods[venta.metodo] || `Método ID ${venta.metodo}`}: ${venta.total}
      </li>
    ))
  ) : (
    <li>No hay ventas registradas.</li>
  )}
</ul>

<h6>Detalle de Retiros</h6>
<ul>
  {closureData.retiros.length > 0 ? (
    closureData.retiros.map((retiro, index) => (
      <li key={index}>
        {retiro.descripcion}: -${retiro.monto}
      </li>
    ))
  ) : (
    <li>No hay retiros registrados.</li>
  )}
</ul>

<h6>Fondos Ingresados</h6>
<ul>
  {closureData.fondos.length > 0 ? (
    closureData.fondos.map((fondo, index) => (
      <li key={index}>
        {fondo.descripcion}: +${fondo.monto}
      </li>
    ))
  ) : (
    <li>No hay fondos registrados.</li>
  )}
</ul>

              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowClosureModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales existentes */}
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
