import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SalesModal from './SalesModal';

function Dashboard() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false); // Modal para fondo
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false); // Modal para retiro
  const [showClosureModal, setShowClosureModal] = useState(false); // Modal para cierre parcial
  const [showStartModal, setShowStartModal] = useState(false); // Modal para apertura de caja
  const [showCloseModal, setShowCloseModal] = useState(false); // Modal para cierre de caja
  const [activeShift, setActiveShift] = useState(null); // Turno activo
  const [closureData, setClosureData] = useState({
    fondoInicial: 0,
    ventasEfectivo: 0,
    totalRetiros: 0,
    fondoFinal: 0,
    ventasPorMetodo: [],
    retiros: [],
    fondos: [],
  });
  const [fundAmount, setFundAmount] = useState(''); // Monto para fondo
  const [fundDescription, setFundDescription] = useState(''); // Descripción de fondo
  const [withdrawalAmount, setWithdrawalAmount] = useState(''); // Monto para retiro
  const [withdrawalDescription, setWithdrawalDescription] = useState(''); // Descripción de retiro
  const [fondoInicial, setFondoInicial] = useState('');
  const [fondoFinal, setFondoFinal] = useState('');
  const [usuario, setUsuario] = useState(''); // Usuario que abre el turno
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
    fetchActiveShift();
  }, [fetchProducts]);

  const fetchActiveShift = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shifts/active');
      setActiveShift(response.data);
    } catch (error) {
      console.error('Error fetching active shift:', error);
    }
  };

  const startShift = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/shifts/start', {
        usuario,
        fondo_inicial: parseFloat(fondoInicial),
      });
      alert('Turno iniciado exitosamente');
      setActiveShift(response.data);
      setShowStartModal(false);
      setFondoInicial('');
      setUsuario('');
    } catch (error) {
      console.error('Error starting shift:', error);
      alert('Error al iniciar turno');
    }
  };

  const closeShift = async () => {
    try {
      await axios.post('http://localhost:5000/api/shifts/close', {
        fondo_final: parseFloat(fondoFinal),
      });
      alert('Turno cerrado exitosamente');
      setActiveShift(null);
      setShowCloseModal(false);
      setFondoFinal('');
    } catch (error) {
      console.error('Error closing shift:', error);
      alert('Error al cerrar turno');
    }
  };

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
      const summary = response.data?.summary || closureData;
  
      // Calcula Fondo en Caja (solo efectivo) y Fondo en Cuenta (otros métodos de pago)
      const efectivo = summary.ventasPorMetodo
        .filter((venta) => venta.metodo === 1) // Método 1: Efectivo
        .reduce((total, venta) => total + parseFloat(venta.total || 0), 0);
  
      const otrosMetodos = summary.ventasPorMetodo
        .filter((venta) => venta.metodo !== 1) // Métodos distintos a efectivo
        .reduce((total, venta) => total + parseFloat(venta.total || 0), 0);
  
      // Calcula fondoCaja y fondoCuenta
      const fondoCaja = efectivo 
        + summary.fondos.reduce((sum, fondo) => sum + parseFloat(fondo.monto || 0), 0) 
        - summary.retiros.reduce((sum, retiro) => sum + parseFloat(retiro.monto || 0), 0);
  
      const fondoCuenta = otrosMetodos;
  
      // Actualiza closureData
      setClosureData({
        ...summary,
        fondoCaja: fondoCaja.toFixed(2),
        fondoCuenta: fondoCuenta.toFixed(2),
      });
  
      setShowClosureModal(true);
    } catch (error) {
      console.error('Error al generar el cierre parcial:', error.response?.data || error.message);
      alert('Error al generar el cierre parcial');
    }
  };
  

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <div className="mb-3">
        {!activeShift ? (
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowStartModal(true)}
          >
            Abrir Caja
          </button>
        ) : (
          <button
            className="btn btn-danger mb-3"
            onClick={() => setShowCloseModal(true)}
          >
            Cerrar Caja
          </button>
        )}
        <button
          className="btn btn-primary mb-3 ms-2"
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

      {/* Modal de Apertura de Caja */}
      {showStartModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Abrir Caja</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowStartModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Usuario:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>Fondo Inicial:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fondoInicial}
                    onChange={(e) => setFondoInicial(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={startShift}>
                  Confirmar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStartModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cierre de Caja */}
      {showCloseModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Cerrar Caja</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowCloseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Fondo Final:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fondoFinal}
                    onChange={(e) => setFondoFinal(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={closeShift}>
                  Confirmar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCloseModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
