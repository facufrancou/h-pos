import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import SalesModal from "./SalesModal";
import ActiveShiftModal from "./ActiveShiftModal";
import ModalAviso from "./ModalAviso";
import { printHtmlContent, exportHtmlToPDF, showAviso } from '../utils/printExportUtils';

function Dashboard() {
  // Estado para el modal de detalle de turno
  const [showShiftDetailModal, setShowShiftDetailModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Función para abrir el modal de detalle de turno
  const handleShowShiftDetail = (shift) => {
    setSelectedShift(shift);
    setShowShiftDetailModal(true);
  };

  // Función para cerrar el modal de detalle de turno
  const handleCloseShiftDetailModal = () => {
    setShowShiftDetailModal(false);
    setSelectedShift(null);
  };
  // Estado para los turnos del día
  const [shiftsToday, setShiftsToday] = useState([]);

  // Obtener los turnos del día actual (filtrando por apertura/cierre dentro del día local)
  const fetchShiftsToday = async () => {
    try {
      const hoy = new Date();
      const response = await axios.get('http://localhost:5000/api/shifts');
      console.log('Turnos recibidos:', response.data);
      // Normaliza una fecha a solo año/mes/día
      const getYMD = (fecha) => {
        if (!fecha) return null;
        const d = new Date(fecha);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      };
      const hoyYMD = `${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()}`;
        const turnosHoy = response.data.filter(turno => {
          // Usar los campos correctos del backend: inicio y cierre
          const aperturaYMD = getYMD(turno.inicio);
          const cierreYMD = getYMD(turno.cierre);
          // Mostrar si apertura es hoy, o cierre es hoy, o si está abierto desde antes y sigue abierto hoy
          if (aperturaYMD === hoyYMD) return true;
          if (cierreYMD === hoyYMD) return true;
          // Si apertura es antes de hoy y cierre está vacío (turno sigue abierto)
          if (aperturaYMD && !turno.cierre) {
            const aperturaDate = new Date(turno.inicio);
            return aperturaDate <= hoy;
          }
          return false;
        });
      console.log('Turnos filtrados para hoy:', turnosHoy);
      setShiftsToday(turnosHoy);
    } catch (error) {
      console.error('Error fetching shifts for today:', error);
    }
  };

  useEffect(() => {
    fetchShiftsToday();
  }, []);
  const resumenRef = useRef();
  // Genera el HTML imprimible/exportable del resumen del día
  const getPrintableHtml = () => {
    // Detalle de ventas del día actual, solo id, monto y método de pago
    let ventasDetalle = '';
    let ventasArray = closureData.ventasDetalle || closureData.ventas || [];
    if (!ventasArray || ventasArray.length === 0) {
      ventasArray = latestSales;
    }
    // Filtrar ventas del día actual
    const hoy = new Date();
    const ventasHoy = ventasArray.filter(v => {
      if (!v.fecha) return false;
      const fechaVenta = new Date(v.fecha);
      return fechaVenta.getDate() === hoy.getDate() && fechaVenta.getMonth() === hoy.getMonth() && fechaVenta.getFullYear() === hoy.getFullYear();
    });
    if (ventasHoy.length > 0) {
      ventasDetalle = ventasHoy.map(venta => `Venta #${venta.id} | Monto: $${venta.total} | Método: ${paymentMethods[venta.metodo_pago_id] || venta.metodo_pago_id}`).join('<br/>');
    } else {
      ventasDetalle = 'No hay ventas registradas.';
    }

    // Detalle de retiros
    let retirosDetalle = '';
    if (closureData.retiros.length > 0) {
      retirosDetalle = closureData.retiros.map(r => `- ${r.descripcion}: $${r.monto}`).join('<br/>');
    } else {
      retirosDetalle = 'No hay retiros registrados.';
    }

    // Detalle de fondos (solo ingresos extra, no aperturas de caja)
    let fondosDetalle = '';
    const fondosExtra = closureData.fondos.filter(f => {
      if (!f.descripcion) return true;
      const desc = f.descripcion.toLowerCase();
      return !desc.includes('fondo inicial') && !desc.includes('apertura');
    });
    if (fondosExtra.length > 0) {
      fondosDetalle = fondosExtra.map(f => `- ${f.descripcion}: $${f.monto}`).join('<br/>');
    } else {
      fondosDetalle = 'No hay fondos registrados.';
    }

    // Detalle de ventas por método
    let ventasPorMetodoDetalle = '';
    if (closureData.ventasPorMetodo.length > 0) {
      ventasPorMetodoDetalle = closureData.ventasPorMetodo.map(v => `- ${paymentMethods[v.metodo] || `Método ID ${v.metodo}`}: $${v.total}`).join('<br/>');
    } else {
      ventasPorMetodoDetalle = 'No hay ventas registradas.';
    }

    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; max-width: 400px;">
        <h3 style="margin-bottom:8px;">Resumen del día</h3>
        <hr />
        <div><strong>Fondo Inicial:</strong> $${closureData.fondoInicial}</div>
        <div><strong>Fondo Final:</strong> $${closureData.fondoFinal}</div>
        <div><strong>Total Retiros:</strong> $${closureData.totalRetiros}</div>
        <div><strong>Fondo en Caja:</strong> $${closureData.fondoCaja || 0}</div>
        <div><strong>Fondo en Cuenta:</strong> $${closureData.fondoCuenta || 0}</div>
        <hr />
        <div><strong>Detalle de Retiros:</strong><br/>${retirosDetalle}</div>
        <hr />
        <div><strong>Detalle de Fondos:</strong><br/>${fondosDetalle}</div>
        <hr />
        <div><strong>Número Total de Ventas:</strong> ${closureData.totalVentasNumero || 0}</div>
        <div><strong>Monto Total de Ventas:</strong> $${closureData.totalVentasMonto || 0}</div>
        <div><strong>Ventas por Método de Pago:</strong><br/>${ventasPorMetodoDetalle}</div>
        <hr />
        <div><strong>Detalle de Ventas:</strong><br/>${ventasDetalle}</div>
        <hr />
        <div><strong>BALANCE FINAL:</strong> $${closureData.fondoFinal}</div>
      </div>
    `;
  };

  // Función para imprimir
  const handlePrint = () => {
    printHtmlContent(getPrintableHtml(), 'Resumen del día');
  };

  // Función para exportar PDF
  const handleExportPDF = () => {
    exportHtmlToPDF(getPrintableHtml(), 'Resumen del día');
  };
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [latestSales, setLatestSales] = useState([]);
  const [showSaleDetailModal, setShowSaleDetailModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
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
  const [fundAmount, setFundAmount] = useState(""); // Monto para fondo
  const [fundDescription, setFundDescription] = useState(""); // Descripción de fondo
  const [withdrawalAmount, setWithdrawalAmount] = useState(""); // Monto para retiro
  const [withdrawalDescription, setWithdrawalDescription] = useState(""); // Descripción de retiro
  const [fondoInicial, setFondoInicial] = useState("");
  const [fondoFinal, setFondoFinal] = useState("");
  const [usuario, setUsuario] = useState(""); // Usuario que abre el turno
  const [showNoShiftModal, setShowNoShiftModal] = useState(false); // Modal para aviso de turno no abierto
  const [aviso, setAviso] = useState({ show: false, mensaje: "" });
  const paymentMethods = {
    1: "Efectivo",
    2: "Transferencia",
    3: "Tarjeta de Débito",
    4: "Tarjeta de Crédito",
    5: "App Delivery",
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("Products fetched:", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchActiveShift();
    fetchLatestSales();
  }, [fetchProducts]);

  const fetchLatestSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales");
      // Tomar las últimas 10 ventas (asumiendo que vienen ordenadas por fecha descendente)
      setLatestSales(response.data.slice(-10).reverse());
    } catch (error) {
      console.error("Error fetching latest sales:", error);
    }
  };
  const handleShowSaleDetail = (sale) => {
    setSelectedSale(sale);
    setShowSaleDetailModal(true);
  };

  const handleCloseSaleDetailModal = () => {
    setShowSaleDetailModal(false);
    setSelectedSale(null);
  };

  const fetchActiveShift = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shifts/active"
      );
      setActiveShift(response.data);
    } catch (error) {
      console.error("Error fetching active shift:", error);
    }
  };

  const startShift = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shifts/start",
        {
          usuario,
          fondo_inicial: parseFloat(fondoInicial),
        }
      );
      setAviso({ show: true, mensaje: "Turno iniciado exitosamente" });
      setActiveShift(response.data);
      setShowStartModal(false);
      setFondoInicial("");
      setUsuario("");
    } catch (error) {
      console.error("Error starting shift:", error);
      setAviso({ show: true, mensaje: "Error al iniciar turno" });
    }
  };

  const closeShift = async () => {
    try {
      await axios.post("http://localhost:5000/api/shifts/close", {
        fondo_final: parseFloat(fondoFinal),
      });
      setAviso({ show: true, mensaje: "Turno cerrado exitosamente" });
      setActiveShift(null);
      setShowCloseModal(false);
      setFondoFinal("");
    } catch (error) {
      console.error("Error closing shift:", error);
      setAviso({ show: true, mensaje: "Error al cerrar turno" });
    }
  };

  const handleFundSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/funds", {
        fecha: new Date().toISOString(),
        descripcion: fundDescription,
        monto: parseFloat(fundAmount),
      });
      setAviso({ show: true, mensaje: "Fondo ingresado correctamente" });
      setShowFundModal(false);
      setFundAmount("");
      setFundDescription("");
    } catch (error) {
      console.error("Error al ingresar fondo:", error);
      setAviso({ show: true, mensaje: "Error al ingresar fondo" });
    }
  };

  const handleWithdrawalSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/withdrawals", {
        fecha: new Date().toISOString(),
        descripcion: withdrawalDescription,
        monto: parseFloat(withdrawalAmount),
      });
      setAviso({ show: true, mensaje: "Retiro ingresado correctamente" });
      setShowWithdrawalModal(false);
      setWithdrawalAmount("");
      setWithdrawalDescription("");
    } catch (error) {
      console.error("Error al ingresar retiro:", error);
      setAviso({ show: true, mensaje: "Error al ingresar retiro" });
    }
  };

  const handleGeneratePartialClosure = async () => {
    try {
      // Cierra el modal de detalle de turno si está abierto
      setShowShiftDetailModal(false);
      setSelectedShift(null);

      const response = await axios.get(
        "http://localhost:5000/api/closures/partial"
      );
      const summary = response.data?.summary || closureData;

      // Calcula Fondo en Caja (solo efectivo) y Fondo en Cuenta (otros métodos de pago)
      const efectivo = summary.ventasPorMetodo
        .filter((venta) => venta.metodo === 1) // Método 1: Efectivo
        .reduce((total, venta) => total + parseFloat(venta.total || 0), 0);

      const otrosMetodos = summary.ventasPorMetodo
        .filter((venta) => venta.metodo !== 1) // Métodos distintos a efectivo
        .reduce((total, venta) => total + parseFloat(venta.total || 0), 0);

      // Calcula fondoCaja y fondoCuenta
      const fondoCaja =
        efectivo +
        summary.fondos.reduce(
          (sum, fondo) => sum + parseFloat(fondo.monto || 0),
          0
        ) -
        summary.retiros.reduce(
          (sum, retiro) => sum + parseFloat(retiro.monto || 0),
          0
        );

      const fondoCuenta = otrosMetodos;

      // Actualiza closureData
      setClosureData({
        ...summary,
        fondoCaja: fondoCaja.toFixed(2),
        fondoCuenta: fondoCuenta.toFixed(2),
      });

      setShowClosureModal(true);
    } catch (error) {
      console.error(
        "Error al generar el cierre parcial:",
        error.response?.data || error.message
      );
      setAviso({ show: true, mensaje: "Error al generar el cierre parcial" });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      setAviso({ show: true, mensaje: e.detail.mensaje });
    };
    window.addEventListener("modalAviso", handler);
    return () => window.removeEventListener("modalAviso", handler);
  }, []);

  return (
    <div className="container-fluid py-5" style={{ background: "#f4f8fb", minHeight: "100vh", maxWidth: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "row" }}>
      <div className="row justify-content-center" style={{ gap: "0px", maxWidth: "100vw", height: "100vh", overflow: "hidden", flex: 1, display: "flex" }}>
        <div className="col-lg-5 d-flex flex-column align-items-center" style={{ minHeight: "100vh", height: "100vh", paddingRight: "24px", overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", maxWidth: "480px", position: "relative" }}>
            <h1 className="mb-4 fw-bold text-center" style={{ fontSize: "2.5rem", letterSpacing: "1px", color: "#0d6efd" }}>Dashboard</h1>
            {/* <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <button
                className="btn btn-primary shadow-sm d-flex align-items-center"
                style={{ fontWeight: "bold", borderRadius: "24px", padding: "8px 20px", fontSize: "1.05rem" }}
                onClick={() => {
                  if (activeShift) {
                    setSelectedShift(activeShift);
                    setShowShiftDetailModal(true);
                  }
                }}
                disabled={!activeShift}
                title={activeShift ? "Ver detalle del turno actual" : "No hay turno activo"}
              >
                <i className="fas fa-user-clock me-2"></i> Ver Turno Actual
              </button>
            </div> */}
             {/* Mostrar ActiveShiftModal solo si hay turno activo */}
            {activeShift && <ActiveShiftModal />}
            <br
            />  


            {/* Tarjeta: Gestión de Caja */}

            <div className="card mb-4 shadow-lg border-0">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="me-3" style={{ fontSize: "2rem", color: "#0d6efd" }}>
                    <i className="fas fa-cash-register"></i>
                  </span>
                  <h4 className="mb-0 fw-bold">Gestión de Caja</h4>
                </div>
                <div className="d-flex gap-3 flex-wrap">
                  {!activeShift ? (
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowStartModal(true)}>
                      <i className="fas fa-door-open me-2"></i> Abrir Caja
                    </button>
                  ) : (
                    <button className="btn btn-danger d-flex align-items-center" onClick={() => setShowCloseModal(true)}>
                      <i className="fas fa-door-closed me-2"></i> Cerrar Caja
                    </button>
                  )}
                  <button className="btn btn-success d-flex align-items-center" onClick={() => setShowFundModal(true)}>
                    <i className="fas fa-plus me-2"></i> Fondo
                  </button>
                  <button className="btn btn-warning d-flex align-items-center" onClick={() => setShowWithdrawalModal(true)}>
                    <i className="fas fa-minus me-2"></i> Retiro
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta: Gestión de Ventas */}
            <div className="card mb-4 shadow-lg border-0">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="me-3" style={{ fontSize: "2rem", color: "#0d6efd" }}>
                    <i className="fas fa-shopping-cart"></i>
                  </span>
                  <h4 className="mb-0 fw-bold">Gestión de Ventas</h4>
                </div>
                <button className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center" style={{ fontWeight: "bold", fontSize: "1.1rem" }} onClick={() => {
                  if (!activeShift) {
                    setShowNoShiftModal(true);
                  } else {
                    setShowSalesModal(true);
                  }
                }}>
                  <i className="fas fa-plus me-2"></i> Nueva Venta
                </button>
              </div>
            </div>

            {/* Tarjeta: Reportes y Resúmenes */}
            <div className="card mb-4 shadow-lg border-0">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="me-3" style={{ fontSize: "2rem", color: "#0d6efd" }}>
                    <i className="fas fa-chart-bar"></i>
                  </span>
                  <h4 className="mb-0 fw-bold">Reportes y Resúmenes</h4>
                </div>
                <button className="btn btn-info btn-lg w-100 d-flex align-items-center justify-content-center" style={{ fontWeight: "bold", fontSize: "1.1rem" }} onClick={handleGeneratePartialClosure}>
                  <i className="fas fa-file-alt me-2"></i> Reporte diario
                </button>
              </div>
            </div>

           

            {/* Modales de Gestión */}
          </div>
      {showStartModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
  
      {showCloseModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
  
      {/* Modales de Fondos */}
      {showFundModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFundModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {showWithdrawalModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                <button
                  className="btn btn-primary"
                  onClick={handleWithdrawalSubmit}
                >
                  Registrar Retiro
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowWithdrawalModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal de Cierre Parcial */}
      {showClosureModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2"></i> Resumen del día
                </h5>
                <button className="btn-close" onClick={() => setShowClosureModal(false)}></button>
              </div>
              <div className="modal-body" style={{ background: "#f8f9fa" }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-balance-scale me-2 text-secondary"></i> Balance</h6>
                    <div className="mb-2">
                      <span className="fw-bold">Fondo Inicial:</span>
                      <span className="badge bg-info ms-2">${closureData.fondoInicial}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">Fondo Final:</span>
                      <span className="badge bg-success ms-2">${closureData.fondoFinal}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">Total Retiros:</span>
                      <span className="badge bg-danger ms-2">-${closureData.totalRetiros}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-shopping-basket me-2 text-secondary"></i> Ventas</h6>
                    <div className="mb-2">
                      <span className="fw-bold">Número Total de Ventas:</span>
                      <span className="badge bg-primary ms-2">{closureData.totalVentasNumero || 0}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">Monto Total de Ventas:</span>
                      <span className="badge bg-success ms-2">${closureData.totalVentasMonto || 0}</span>
                    </div>
                  </div>
                </div>
                <hr />
                {/* Resumen de turnos del día */}
                <div className="row g-4">
                  <div className="col-12">
                    <h6 className="mb-3"><i className="fas fa-user-clock me-2 text-secondary"></i> Resumen de Turnos del Día</h6>
                    <ul className="list-unstyled">
                      {shiftsToday.length > 0 ? (
                        shiftsToday.map((turno, idx) => (
                          <li key={idx} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '10px' }}>
                            <div>
                              <span className="fw-bold">{turno.usuario || 'Sin nombre'}</span>
                              <span className="ms-2 text-muted">{turno.inicio ? new Date(turno.inicio).toLocaleString() : '-'}</span>
                            </div>
                            <button className="btn btn-sm btn-outline-info" onClick={() => handleShowShiftDetail(turno)}>Ver detalle</button>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted">No hay turnos registrados hoy.</li>
                      )}
  {/* Línea separadora entre resumen de turnos y detalle de fondos */}
  <hr />
      {/* Modal de detalle de turno */}
      {showShiftDetailModal && selectedShift && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow-lg" style={{ borderRadius: "16px", background: "#f8fafd" }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #e3e6ee", background: "#f4f8fb" }}>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.5rem", color: "#0d6efd" }}>
                  <i className="fas fa-user-clock me-2"></i> Detalle de Turno: <span style={{ color: "#333" }}>{selectedShift.usuario}</span>
                </h5>
                <button className="btn-close" onClick={handleCloseShiftDetailModal}></button>
              </div>
              <div className="modal-body" style={{ background: "#f8fafd", padding: "2rem" }}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <span className="fw-bold"><i className="fas fa-door-open me-2 text-primary"></i>Apertura:</span>
                    <span className="ms-2">{selectedShift.inicio ? new Date(selectedShift.inicio).toLocaleString() : '-'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <span className="fw-bold"><i className="fas fa-door-closed me-2 text-secondary"></i>Cierre:</span>
                    <span className="ms-2">{selectedShift.cierre ? new Date(selectedShift.cierre).toLocaleString() : '-'}</span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4 mb-2">
                    <span className="fw-bold"><i className="fas fa-shopping-basket me-2 text-success"></i>Ventas Totales:</span>
                    <span className="badge bg-success ms-2" style={{ fontSize: "1em" }}>${selectedShift.ventas_totales || 0}</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <span className="fw-bold"><i className="fas fa-wallet me-2 text-info"></i>Ingresos Totales:</span>
                    <span className="badge bg-info ms-2" style={{ fontSize: "1em" }}>${selectedShift.ingresos_totales || 0}</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <span className="fw-bold"><i className="fas fa-arrow-circle-down me-2 text-danger"></i>Retiros Totales:</span>
                    <span className="badge bg-danger ms-2" style={{ fontSize: "1em" }}>${selectedShift.retiros_totales || 0}</span>
                  </div>
                </div>
                <hr />
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#0d6efd" }}><i className="fas fa-shopping-cart me-2"></i>Ventas</h6>
                  {selectedShift.ventas && selectedShift.ventas.length > 0 ? (
                    <ul className="ps-3" style={{ marginBottom: 0 }}>
                      {selectedShift.ventas.map((venta, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          <span className="fw-bold text-primary">#{venta.id}</span> - <span className="fw-bold">${typeof venta.total === 'number' ? venta.total.toFixed(2) : Number(venta.total).toFixed(2)}</span> - <span>{venta.fecha ? new Date(venta.fecha).toLocaleString() : ''}</span> - <span className="badge bg-secondary">Método: {paymentMethods[venta.metodo_pago_id] || venta.metodo_pago_id}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted">No hay ventas.</p>}
                </div>
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#0d6efd" }}><i className="fas fa-wallet me-2"></i>Fondos</h6>
                  {selectedShift.fondos && selectedShift.fondos.length > 0 ? (
                    <ul className="ps-3" style={{ marginBottom: 0 }}>
                      {selectedShift.fondos.map((fondo, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          <span className="fw-bold">{fondo.descripcion}:</span> <span className="badge bg-success">${fondo.monto}</span> <span className="text-muted">({fondo.fecha ? new Date(fondo.fecha).toLocaleString() : ''})</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted">No hay fondos.</p>}
                </div>
                <div className="mb-2">
                  <h6 className="fw-bold mb-2" style={{ color: "#0d6efd" }}><i className="fas fa-arrow-circle-down me-2"></i>Retiros</h6>
                  {selectedShift.retiros && selectedShift.retiros.length > 0 ? (
                    <ul className="ps-3" style={{ marginBottom: 0 }}>
                      {selectedShift.retiros.map((retiro, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          <span className="fw-bold">{retiro.descripcion}:</span> <span className="badge bg-danger">${retiro.monto}</span> <span className="text-muted">({retiro.fecha ? new Date(retiro.fecha).toLocaleString() : ''})</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted">No hay retiros.</p>}
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #e3e6ee" }}>
                <button className="btn btn-outline-primary fw-bold px-4" style={{ borderRadius: "8px" }} onClick={handleCloseShiftDetailModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
                    </ul>
                  </div>
                </div>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-wallet me-2 text-secondary"></i> Detalle de Fondos</h6>
                    <ul className="list-unstyled">
                      <li><span className="fw-bold">Fondo en Caja:</span> <span className="badge bg-info">${closureData.fondoCaja || 0}</span></li>
                      <li><span className="fw-bold">Fondo en Cuenta:</span> <span className="badge bg-warning text-dark">${closureData.fondoCuenta || 0}</span></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-credit-card me-2 text-secondary"></i> Ventas por Método de Pago</h6>
                    <ul className="list-unstyled">
                      {closureData.ventasPorMetodo.length > 0 ? (
                        closureData.ventasPorMetodo.map((venta, index) => (
                          <li key={index}>
                            <span className="fw-bold">{paymentMethods[venta.metodo] || `Método ID ${venta.metodo}`}:</span> <span className="badge bg-primary">${venta.total}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted">No hay ventas registradas.</li>
                      )}
                    </ul>
                  </div>
                </div>
                <hr />
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-arrow-circle-down me-2 text-secondary"></i> Detalle de Retiros</h6>
                    <ul className="list-unstyled">
                      {closureData.retiros.length > 0 ? (
                        closureData.retiros.map((retiro, index) => (
                          <li key={index}><span className="fw-bold">{retiro.descripcion}:</span> <span className="badge bg-danger">-${retiro.monto}</span></li>
                        ))
                      ) : (
                        <li className="text-muted">No hay retiros registrados.</li>
                      )}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3"><i className="fas fa-arrow-circle-up me-2 text-secondary"></i> Fondos Ingresados</h6>
                    <ul className="list-unstyled">
                      {(() => {
                        const fondosExtra = closureData.fondos.filter(f => {
                          if (!f.descripcion) return true;
                          const desc = f.descripcion.toLowerCase();
                          return !desc.includes('fondo inicial') && !desc.includes('apertura');
                        });
                        if (fondosExtra.length > 0) {
                          return fondosExtra.map((fondo, index) => (
                            <li key={index}><span className="fw-bold">{fondo.descripcion}:</span> <span className="badge bg-success">+${fondo.monto}</span></li>
                          ));
                        } else {
                          return <li className="text-muted">No hay fondos registrados.</li>;
                        }
                      })()}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-primary me-2" onClick={handlePrint}>Imprimir</button>
                <button className="btn btn-outline-success me-2" onClick={handleExportPDF}>Exportar PDF</button>
                <button className="btn btn-secondary" onClick={() => setShowClosureModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
  
        </div>
        {/* Panel lateral de últimas ventas */}
        <div className="col-lg-7" style={{ borderLeft: "1px solid #e3e6ee", background: "#f8f9fa", minHeight: "100vh", height: "100vh", maxWidth: "700px", paddingLeft: "32px", overflow: "hidden", flex: "0 0 700px", display: "flex", flexDirection: "column" }}>
          <h3 className="mt-4 mb-4 fw-bold text-center" style={{ color: "#0d6efd" }}>Últimas Ventas</h3>
          <div className="d-flex flex-column gap-3" style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
            {latestSales.length === 0 ? (
              <div className="card shadow-sm border-0 p-3 text-center text-muted">No hay ventas recientes.</div>
            ) : (
              latestSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center justify-content-between" style={{ background: "#fff" }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: "1.1rem" }}><span style={{ color: "#0d6efd" }}>#{sale.id}</span> - {sale.cliente ? `${sale.cliente.nombre} ${sale.cliente.apellido}` : "Sin cliente"}</div>
                    <div style={{ fontSize: "0.95em", color: "#888" }}>{new Date(sale.fecha).toLocaleString()}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary" style={{ fontSize: "1rem", minWidth: "80px" }}>${sale.total}</span>
                    <button className="btn btn-sm btn-outline-info" style={{ fontWeight: "bold" }} onClick={() => handleShowSaleDetail(sale)}>Ver detalle</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modales existentes */}
      <SalesModal
        show={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onSaleRegistered={fetchLatestSales}
      />

      {/* Modal de detalle de venta */}
      {showSaleDetailModal && selectedSale && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Detalle de Venta #{selectedSale.id}</h5>
                <button className="btn-close" onClick={handleCloseSaleDetailModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Fecha:</strong> {new Date(selectedSale.fecha).toLocaleString()}</p>
                <p><strong>Cliente:</strong> {selectedSale.cliente ? `${selectedSale.cliente.nombre} ${selectedSale.cliente.apellido}` : "Sin cliente"}</p>
                <p><strong>Total:</strong> ${selectedSale.total}</p>
                <p><strong>Método de Pago:</strong> {paymentMethods[selectedSale.metodo_pago_id] || selectedSale.metodo_pago_id}</p>
                <h6>Productos</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.productos && selectedSale.productos.length > 0 ? (
                      selectedSale.productos.map((sp) => (
                        <tr key={sp.id}>
                          <td>{sp.producto ? sp.producto.nombre : ""}</td>
                          <td>{sp.cantidad}</td>
                          <td>${sp.precio_unitario}</td>
                          <td>${sp.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4">No hay productos.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseSaleDetailModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de aviso: turno no abierto */}
      {showNoShiftModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="mb-0"><i className="fas fa-exclamation-triangle me-2"></i> Aviso</h5>
                <button className="btn-close" onClick={() => setShowNoShiftModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Debe abrir el turno antes de registrar una venta.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => {
                  setShowNoShiftModal(false);
                  setShowStartModal(true);
                }}>Abrir Turno</button>
                <button className="btn btn-secondary" onClick={() => setShowNoShiftModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalAviso show={aviso.show} mensaje={aviso.mensaje} onClose={() => setAviso({ show: false, mensaje: "" })} />
    </div>
  );
}

export default Dashboard;
