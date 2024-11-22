import React, { useState, useEffect } from "react";
import { getProducts, createSale, downloadDailyReport } from "../services/api";
import ProductTable from "../components/ProductTable";
import SalesModal from "../components/SalesModal";
import InitialCashModal from "../components/InitialCashModal";
import WithdrawalModal from "../components/WithdrawalModal";

function Dashboard() {
  const [products, setProducts] = useState([]); // Inicializar como array vacío
  const [selectedProducts, setSelectedProducts] = useState([]); // Inicializar como array vacío
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showInitialCashModal, setShowInitialCashModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmXModal, setShowConfirmXModal] = useState(false); // Modal de confirmación para cierre X
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [closeShiftData, setCloseShiftData] = useState({
    type: "", // Tipo de cierre (X o Z)
    date: "",
    initialCash: 0,
    totalSales: 0,
    totalWithdrawals: 0,
    paymentMethodTotals: {}, // Objeto vacío para métodos de pago
    cashInBox: 0,
    moneyInAccount: 0,
    finalCash: 0,
    withdrawalDetails: [], // Lista vacía para los detalles de retiros
  });

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data || [])) // Garantizar que sea un array
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
        setProducts([]); // Manejo de error, garantizar array vacío
      });
  }, []);

  const handleConfirmSale = (paymentMethod) => {
    // Función para obtener la fecha ajustada a la hora local sin el sufijo 'Z'
    const getLocalISOString = () => {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
      const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
      return localTime.toISOString().slice(0, -1); // Remover el sufijo 'Z'
    };
  
    const sale = {
      products: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price:
          paymentMethod === "App Delivery"
            ? product.priceAlt || product.price
            : product.price,
        quantity: product.quantity,
        total:
          product.quantity *
          (paymentMethod === "App Delivery"
            ? product.priceAlt || product.price
            : product.price),
      })),
      paymentMethod,
      total: selectedProducts.reduce((sum, product) => {
        const price =
          paymentMethod === "App Delivery"
            ? product.priceAlt || product.price
            : product.price;
        return sum + price * product.quantity;
      }, 0),
      date: getLocalISOString(), // Usar la fecha ajustada en formato sin 'Z'
    };
  
    createSale(sale)
      .then(() => {
        alert("Venta registrada con éxito");
        setSelectedProducts([]); // Vaciar los productos seleccionados
      })
      .catch((error) => console.error("Error al registrar la venta:", error));
  };
  
  
  const handleInitialCash = async (data) => {
    try {
      await fetch("http://localhost:5000/sales/initial-cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Fondo inicial registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar el fondo inicial:", error);
    }
  };

  const handleWithdrawal = async (data) => {
    try {
      await fetch("http://localhost:5000/sales/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Retiro registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar el retiro:", error);
    }
  };

  const handleCloseShift = async (reset = false) => {
    try {
      const response = await fetch(
        `http://localhost:5000/sales/close-shift${reset ? "?reset=true" : ""}`
      );
      const data = await response.json();
      setCloseShiftData({
        type: data.type || "",
        date: data.date || "",
        closureNumber: data.closureNumber || 0, // Incluir el número de cierre
        initialCash: data.initialCash || 0,
        totalSales: data.totalSales || 0,
        totalWithdrawals: data.totalWithdrawals || 0,
        paymentMethodTotals: data.paymentMethodTotals || {},
        cashInBox: data.cashInBox || 0,
        moneyInAccount: data.moneyInAccount || 0,
        finalCash: data.finalCash || 0,
        withdrawalDetails: data.withdrawalDetails || [],
      });
      setShowCloseShiftModal(true);
    } catch (error) {
      console.error("Error al realizar el cierre:", error);
      alert(
        "Hubo un error al realizar el cierre. Por favor, intenta de nuevo."
      );
    }
  };

  const downloadCloseShiftPDF = async (type) => {
    try {
      const response = await fetch(
        "http://localhost:5000/sales/pdf/close-shift",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...closeShiftData, type }),
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Cierre_${type}_${new Date().toLocaleDateString()}.pdf`
      );
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
          className="btn btn-success"
          onClick={() => setShowWithdrawalModal(true)}
        >
          Salida de Fondos
        </button>
        <button className="btn btn-success" onClick={downloadDailyReport}>
          Descargar Reporte Diario
        </button>
        <button
          className="btn btn-warning"
          onClick={() => setShowConfirmXModal(true)} // Mostrar el modal de confirmación para cierre X
        >
          Cierre Parcial (X)
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setShowConfirmModal(true)} // Mostrar el modal
        >
          Cierre Total (Z)
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

{showCloseShiftModal && (
  <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>
            Resumen del Cierre {closeShiftData.type} - N° {closeShiftData.closureNumber}
          </h5>
          <button
            className="btn-close"
            onClick={() => setShowCloseShiftModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Fecha:</strong>{" "}
            {closeShiftData.date
              ? new Date(closeShiftData.date).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Número de Cierre:</strong> {closeShiftData.closureNumber || 0}
          </p>
          <p>
            <strong>Fondo Inicial:</strong> $ {closeShiftData.initialCash || 0}
          </p>
          <p>
            <strong>Ventas Totales:</strong> $ {closeShiftData.totalSales || 0}
          </p>

          <h6>Desglose por Método de Pago:</h6>
          <ul>
            {closeShiftData.paymentMethodTotals &&
              Object.entries(closeShiftData.paymentMethodTotals).map(([method, total]) => (
                <li key={method}>
                  <strong>{method}:</strong> ${total}
                </li>
              ))}
          </ul>

          <p>
            <strong>Retiros Totales:</strong> $ {closeShiftData.totalWithdrawals || 0}
          </p>

          <h6>Arqueo Parcial:</h6>
          <p>
            <strong>Efectivo en Caja:</strong> $ {closeShiftData.cashInBox || 0}
          </p>
          <p>
            <strong>Dinero en Cuenta:</strong> $ {closeShiftData.moneyInAccount || 0}
          </p>
          <p>
            <strong>Total Final:</strong> ${closeShiftData.finalCash || 0}
          </p>

          <h6>Detalle de Retiros:</h6>
          {closeShiftData.withdrawalDetails &&
          closeShiftData.withdrawalDetails.length > 0 ? (
            <ul>
              {closeShiftData.withdrawalDetails.map((withdrawal, index) => (
                <li key={index}>
                  {new Date(withdrawal.date).toLocaleString()} -{" "}
                  <strong> Operador:</strong> {withdrawal.operator} -{" "}
                  <strong> Monto:</strong> ${withdrawal.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No se registraron retiros durante el turno.</p>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={() => downloadCloseShiftPDF(closeShiftData.type)}
          >
            Descargar PDF
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowCloseShiftModal(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Modal de Confirmación para el Cierre Z */}
      {showConfirmModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirmar Cierre de Caja</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Está seguro de que desea realizar el cierre de caja?
                </p>
                <p>
                 Esta acción no se puede revertir.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleCloseShift(true); // Ejecutar cierre Z
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmXModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirmar Cierre de Turno</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmXModal(false)} // Cerrar modal sin hacer nada
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Está seguro de que desea realizar el cierre de turno?
                </p>
                <p>
                  Esta acción no limpiará datos, pero actualizará el fondo de caja.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmXModal(false)} // Cerrar modal
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => {
                    setShowConfirmXModal(false); // Cerrar modal
                    handleCloseShift(false); // Realizar el cierre X
                  }}
                >
                  Confirmar
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
