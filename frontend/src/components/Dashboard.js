import React, { useState, useEffect } from 'react';
import { getProducts, createSale, downloadDailyReport } from '../services/api';
import ProductTable from '../components/ProductTable';
import SalesModal from '../components/SalesModal';
import InitialCashModal from '../components/InitialCashModal';
import WithdrawalModal from '../components/WithdrawalModal';
import axios from 'axios';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showInitialCashModal, setShowInitialCashModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // Modal para el cierre
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [closeShiftData, setCloseShiftData] = useState({});

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleConfirmSale = (paymentMethod) => {
    const sale = {
      products: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price,
        quantity: product.quantity,
        total: product.quantity * (paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price),
      })),
      paymentMethod,
      total: selectedProducts.reduce((sum, product) => {
        const price = paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price;
        return sum + price * product.quantity;
      }, 0),
      date: new Date().toISOString(),
    };
  
    createSale(sale)
      .then(() => {
        alert('Venta registrada con éxito');
        setSelectedProducts([]); // Vaciar los productos seleccionados
      })
      .catch((error) => console.error('Error al registrar la venta:', error));
  };

  const handleInitialCash = async (data) => {
    try {
      await axios.post('http://localhost:5000/sales/initial-cash', data);
      alert('Fondo inicial registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar el fondo inicial:', error);
    }
  };

  const handleWithdrawal = async (data) => {
    try {
      await axios.post('http://localhost:5000/sales/withdrawals', data);
      alert('Retiro registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar el retiro:', error);
    }
  };

 
  /* const handleCloseShift = async (reset = false) => {
    try {
      const response = await axios.get(`http://localhost:5000/sales/close-shift${reset ? '?reset=true' : ''}`);
      const {
        totalSales,
        totalWithdrawals,
        withdrawalDetails,
        paymentBreakdown,
        initialCash,
        cashInHand,
        moneyInAccount,
        finalCash,
      } = response.data;
  
      // Almacenar los datos del cierre y mostrar el modal
      setCloseShiftData({
        totalSales,
        totalWithdrawals,
        withdrawalDetails,
        paymentBreakdown,
        initialCash,
        cashInHand,
        moneyInAccount,
        finalCash,
        reset,
      });
      setShowCloseShiftModal(true);
    } catch (error) {
      console.error('Error al realizar el cierre:', error);
    }
  }; */
  const handleCloseShift = async (reset = false) => {
    try {
      const response = await axios.get(`http://localhost:5000/sales/close-shift${reset ? '?reset=true' : ''}`);
      const {
        totalSales,
        paymentMethodTotals,
        totalWithdrawals,
        withdrawalDetails,
        initialCash,
        cashInBox,
        moneyInAccount,
        finalCash,
        type,
        date,
      } = response.data;
  
      // Almacenar los datos del cierre y mostrar el modal
      setCloseShiftData({
        totalSales,
        paymentMethodTotals,
        totalWithdrawals,
        withdrawalDetails,
        initialCash,
        cashInBox,
        moneyInAccount,
        finalCash,
        type,
        date,
      });
      setShowCloseShiftModal(true);
    } catch (error) {
      console.error('Error al realizar el cierre:', error);
    }
  };
  const downloadCloseShiftPDF = async (type) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/sales/pdf/close-shift',
        { ...closeShiftData, type },
        { responseType: 'blob' }
      );
  
      const blobURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobURL;
      link.setAttribute('download', `Cierre_${type}_${new Date().toLocaleDateString()}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`Error al generar el PDF de cierre ${type}:`, error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Punto de Venta</h1>
      
      <div className="mb-4 d-flex justify-content-between">
        <button
          className="btn btn-success"
          onClick={() => setShowInitialCashModal(true)}
        >
          Registrar Fondo de Caja
        </button>
        <button
          className="btn btn-warning"
          onClick={() => setShowWithdrawalModal(true)}
        >
          Registrar Retiro
        </button>
        <button
          className="btn btn-info"
          onClick={() => handleCloseShift(false)}
        >
          Cierre X
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleCloseShift(true)}
        >
          Cierre Z
        </button>
        <button
          className="btn btn-secondary"
          onClick={downloadDailyReport}
        >
          Descargar Reporte Diario
        </button>
      </div>

      <ProductTable
        products={products}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowSalesModal(true)}
      >
        Finalizar Venta
      </button>

      {/* Modales */}
      <SalesModal
        show={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        handleConfirm={handleConfirmSale}
      />
      <InitialCashModal
        show={showInitialCashModal}
        onClose={() => setShowInitialCashModal(false)}
        handleConfirm={handleInitialCash}
      />
      <WithdrawalModal
        show={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        handleConfirm={handleWithdrawal}
      />

      {/* Modal de Cierre */}
      {showCloseShiftModal && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Resumen del Cierre {closeShiftData.type}</h5>
          <button className="btn-close" onClick={() => setShowCloseShiftModal(false)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Fecha:</strong> {new Date(closeShiftData.date).toLocaleString()}</p>
          <p><strong>Fondo Inicial:</strong> ${closeShiftData.initialCash}</p>
          <p><strong>Ventas Totales:</strong> ${closeShiftData.totalSales}</p>
          
          <h6>Desglose por Método de Pago:</h6>
          <ul>
            {Object.entries(closeShiftData.paymentMethodTotals).map(([method, total]) => (
              <li key={method}>
                <strong>{method}:</strong> ${total}
              </li>
            ))}
          </ul>
          
          <p><strong>Retiros Totales:</strong> ${closeShiftData.totalWithdrawals}</p>

          <h6>Arqueo Parcial:</h6>
          <p><strong>Efectivo en Caja:</strong> ${closeShiftData.cashInBox}</p>
          <p><strong>Dinero en Cuenta:</strong> ${closeShiftData.moneyInAccount}</p>
          <p><strong>Total Final:</strong> ${closeShiftData.finalCash}</p>
          
          <h6>Detalle de Retiros:</h6>
          {closeShiftData.withdrawalDetails.length === 0 ? (
            <p>No se registraron retiros durante el turno.</p>
          ) : (
            <ul>
              {closeShiftData.withdrawalDetails.map((withdrawal) => (
                <li key={withdrawal.id}>
                  {withdrawal.date} - <strong>Operador:</strong> {withdrawal.operator} - <strong>Monto:</strong> ${withdrawal.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={() => downloadCloseShiftPDF(closeShiftData.type)}
          >
            Descargar PDF
          </button>
          <button className="btn btn-secondary" onClick={() => setShowCloseShiftModal(false)}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Dashboard;
