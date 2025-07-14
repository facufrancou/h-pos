import React, { useState, useEffect } from "react";
import { printHtmlContent, exportHtmlToPDF } from "../utils/printExportUtils";
import axios from "axios";

function ActiveShiftModal() {
  // Ref para el contenido a imprimir/exportar
  const resumenRef = React.useRef();

  // Generar HTML para imprimir/exportar
  const getPrintableHtml = () => {
    if (!shiftData) return "";
    const fondoInicial = Number(shiftData.turno.fondo_inicial) || 0;
    const fondosIngresados =
      Number(
        shiftData.fondos.detalle
          ?.filter((f) => f.tipo === "ingreso")
          .reduce((acc, f) => acc + Number(f.monto), 0)
      ) || 0;
    const retiros = Number(shiftData.retiros.total) || 0;
    const ventasEfectivo =
      shiftData.ventas.detalle
        ?.filter((v) => v.metodo === "Efectivo")
        .reduce((acc, v) => acc + Number(v.total), 0) || 0;
    const esperado = fondoInicial + ventasEfectivo + fondosIngresados - retiros;
    // Resumen por método de pago
    const ventasPorMetodo = {};
    shiftData.ventas.detalle?.forEach((v) => {
      ventasPorMetodo[v.metodo] =
        (ventasPorMetodo[v.metodo] || 0) + Number(v.total);
    });
    // Detalle de ventas
    const ventasDetalleHtml = shiftData.ventas.detalle?.length
      ? `<ul style="padding-left:16px;">${shiftData.ventas.detalle
          .map(
            (v) =>
              `<li>ID: ${v.id} | Monto: $${v.total} | Método: ${
                v.metodo
              } | Fecha: ${new Date(v.fecha).toLocaleString()}</li>`
          )
          .join("")}</ul>`
      : "<span>No hay ventas registradas.</span>";
    // Detalle de retiros
    const retirosDetalleHtml = shiftData.retiros.detalle?.length
      ? `<ul style="padding-left:16px;">${shiftData.retiros.detalle
          .map(
            (r) =>
              `<li>${r.descripcion}: $${r.monto} - ${new Date(
                r.fecha
              ).toLocaleString()}</li>`
          )
          .join("")}</ul>`
      : "<span>No hay retiros registrados.</span>";
    // Detalle de fondos
    const fondosDetalleHtml = shiftData.fondos.detalle?.length
      ? `<ul style="padding-left:16px;">${shiftData.fondos.detalle
          .map(
            (f) =>
              `<li>${f.descripcion}: $${f.monto} - ${new Date(
                f.fecha
              ).toLocaleString()}</li>`
          )
          .join("")}</ul>`
      : "<span>No hay movimientos de fondos.</span>";
    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; max-width: 350px;">
        <h3 style="margin-bottom:8px;">Resumen de Turno</h3>
        <div><strong>Usuario:</strong> ${shiftData.turno.usuario}</div>
        <div><strong>Inicio:</strong> ${new Date(
          shiftData.turno.inicio
        ).toLocaleString()}</div>
        <hr />
        <h4 style="margin-bottom:4px;">Resumen de Cierre de Caja</h4>
        <div><strong>Fondo Inicial:</strong> $${fondoInicial.toFixed(2)}</div>
        <div><strong>Fondos Ingresados:</strong> $${fondosIngresados.toFixed(
          2
        )}</div>
        <div><strong>Retiros:</strong> -$${retiros.toFixed(2)}</div>
        <div><strong>Ventas en Efectivo:</strong> $${ventasEfectivo.toFixed(
          2
        )}</div>
        <div><strong>Dinero esperado en caja:</strong> $${esperado.toFixed(
          2
        )}</div>
        <hr />
        <h4 style="margin-bottom:4px;">Resumen de Ventas</h4>
        <div><strong>Total de Ventas:</strong> $${shiftData.ventas.total}</div>
        <div><strong>Número Total de Ventas:</strong> ${
          shiftData.ventas.detalle.length
        }</div>
        <div><strong>Por método de pago:</strong></div>
        <ul style="padding-left:16px;">${Object.entries(ventasPorMetodo)
          .map(([metodo, monto]) => `<li>${metodo}: $${monto.toFixed(2)}</li>`)
          .join("")}</ul>
        <div><strong>Detalle de Ventas:</strong></div>
        ${ventasDetalleHtml}
        <hr />
        <h4 style="margin-bottom:4px;">Resumen de Retiros</h4>
        <div><strong>Total de Retiros:</strong> $${
          shiftData.retiros.total
        }</div>
        <div><strong>Detalle de Retiros:</strong></div>
        ${retirosDetalleHtml}
        <hr />
        <h4 style="margin-bottom:4px;">Detalle de Fondos</h4>
        ${fondosDetalleHtml}
      </div>
    `;
  };

  // Función para imprimir
  const handlePrint = () => {
    printHtmlContent(getPrintableHtml(), "Resumen de Turno");
  };

  // Función para exportar PDF
  const handleExportPDF = () => {
    exportHtmlToPDF(getPrintableHtml(), "Resumen de Turno");
  };
  const [shiftData, setShiftData] = useState(null); // Datos del turno activo
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [hasActiveShift, setHasActiveShift] = useState(false); // Estado de turno activo
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores

  // Verificar si hay un turno activo al cargar el componente
  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/shifts/active"
        );
        setHasActiveShift(!!response.data); // Si hay turno activo, cambiar a true
      } catch (err) {
        setHasActiveShift(false); // No hay turno activo
        console.error("Error al verificar turno activo:", err);
      }
    };

    checkActiveShift();
  }, []);

  // Función para obtener los datos del turno
  const fetchShiftDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/shifts/details"
      );
      setShiftData(response.data); // Guardar los datos del turno
      setShowModal(true); // Mostrar el modal
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los datos del turno.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mostrar el botón solo si hay un turno activo */}
      {hasActiveShift && (
        /*     <button
          className="btn btn-info"
          onClick={fetchShiftDetails}
        >
          Ver Turno Actual
        </button> */
        <button
          className="btn btn-primary shadow-sm d-flex align-items-center"
          style={{
            fontWeight: "bold",
            borderRadius: "24px",
            padding: "8px 20px",
            fontSize: "1.05rem",
          }}
          onClick={fetchShiftDetails}
        >
          <i className="fas fa-user-clock me-2"></i> Ver Turno Actual
        </button>
      )}

      {/* Modal de datos del turno */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <i className="bi bi-clipboard-data me-2"></i>
                <h5 className="mb-0">Detalles del Turno en Curso</h5>
                <div className="ms-auto text-end">
                  <div>
                    <strong>Usuario:</strong> {shiftData?.turno?.usuario}
                  </div>
                  <div>
                    <strong>Inicio:</strong>{" "}
                    {shiftData?.turno?.inicio
                      ? new Date(shiftData.turno.inicio).toLocaleString()
                      : ""}
                  </div>
                </div>
                <button
                  className="btn-close btn-close-white ms-2"
                  onClick={() => setShowModal(false)}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <p>Cargando datos...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <>
                    <div className="container-fluid">
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <div className="p-3 border rounded shadow-sm mb-2 h-100">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-cart me-2 fs-5 text-success"></i>
                              <span className="fw-bold text-success">
                                Ventas
                              </span>
                            </div>
                            <div>
                              <div className="mb-1">
                                <strong>Número Total de Ventas:</strong>{" "}
                                <span className="badge bg-primary">
                                  {shiftData.ventas.detalle.length}
                                </span>
                              </div>
                              <div className="mb-1">
                                <strong>Monto Total de Ventas:</strong>{" "}
                                <span className="badge bg-success">
                                  ${shiftData.ventas.total}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 border rounded shadow-sm mb-2 h-100">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-cash-coin me-2 fs-5 text-warning"></i>
                              <span className="fw-bold text-warning">
                                Fondos Ingresados
                              </span>
                            </div>
                            <div>
                              <strong>Fondo inicial al abrir caja:</strong>{" "}
                              <span className="badge bg-success">
                                +${shiftData.turno.fondo_inicial}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <div className="p-3 border rounded shadow-sm mb-2 h-100">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-wallet2 me-2 fs-5 text-info"></i>
                              <span className="fw-bold text-info">
                                Detalle de Fondos
                              </span>
                            </div>
                            <div>
                              {shiftData.fondos.detalle.length === 0 ? (
                                <span className="text-muted">
                                  No hay movimientos de fondos.
                                </span>
                              ) : (
                                <div className="bg-light p-2 rounded">
                                  <strong>Fondo inicial al abrir caja:</strong>{" "}
                                  <span className="text-dark">
                                    ${shiftData.fondos.detalle[0].monto}
                                  </span>{" "}
                                  -{" "}
                                  <span className="text-muted">
                                    {new Date(
                                      shiftData.fondos.detalle[0].fecha
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 border rounded shadow-sm mb-2 h-100">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-arrow-down-circle me-2 fs-5 text-secondary"></i>
                              <span className="fw-bold text-secondary">
                                Detalle de Retiros
                              </span>
                            </div>
                            <div>
                              {shiftData.retiros.detalle.length === 0 ? (
                                <span className="text-muted">
                                  No hay retiros registrados.
                                </span>
                              ) : (
                                <ul className="list-unstyled mb-0">
                                  {shiftData.retiros.detalle.map((retiro) => (
                                    <li key={retiro.id} className="mb-1">
                                      <strong>{retiro.descripcion}:</strong>{" "}
                                      <span className="badge bg-danger">
                                        ${retiro.monto}
                                      </span>{" "}
                                      <span className="text-muted">
                                        -{" "}
                                        {new Date(
                                          retiro.fecha
                                        ).toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-12">
                          <div
                            className="p-3 border rounded shadow-sm mb-2 bg-white"
                            ref={resumenRef}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-cash-stack me-2 fs-5 text-success"></i>
                              <span className="fw-bold text-success">
                                Resumen de Cierre de Caja
                              </span>
                            </div>
                            <div>
                              {/* Calculo de ventas en efectivo */}
                              {(() => {
                                const fondoInicial =
                                  Number(shiftData.turno.fondo_inicial) || 0;
                                const fondosIngresados =
                                  Number(
                                    shiftData.fondos.detalle
                                      ?.filter((f) => f.tipo === "ingreso")
                                      .reduce(
                                        (acc, f) => acc + Number(f.monto),
                                        0
                                      )
                                  ) || 0;
                                const retiros =
                                  Number(shiftData.retiros.total) || 0;
                                // Sumar solo ventas en efectivo
                                const ventasEfectivo =
                                  shiftData.ventas.detalle
                                    ?.filter((v) => v.metodo === "Efectivo")
                                    .reduce(
                                      (acc, v) => acc + Number(v.total),
                                      0
                                    ) || 0;
                                const esperado =
                                  fondoInicial +
                                  ventasEfectivo +
                                  fondosIngresados -
                                  retiros;
                                return (
                                  <>
                                    <div>
                                      <strong>Fondo Inicial:</strong>{" "}
                                      <span className="badge bg-info">
                                        ${fondoInicial.toFixed(2)}
                                      </span>
                                    </div>
                                    <div>
                                      <strong>Ventas en Efectivo:</strong>{" "}
                                      <span className="badge bg-primary">
                                        ${ventasEfectivo.toFixed(2)}
                                      </span>
                                    </div>
                                    <div>
                                      <strong>Fondos Ingresados:</strong>{" "}
                                      <span className="badge bg-success">
                                        ${fondosIngresados.toFixed(2)}
                                      </span>
                                    </div>
                                    <div>
                                      <strong>Retiros:</strong>{" "}
                                      <span className="badge bg-danger">
                                        -${retiros.toFixed(2)}
                                      </span>
                                    </div>
                                    <hr />
                                    <div className="fs-5">
                                      <strong>Dinero esperado en caja:</strong>{" "}
                                      <span className="badge bg-dark">
                                        ${esperado.toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handlePrint}
                >
                  Imprimir
                </button>
                <button
                  className="btn btn-outline-success me-2"
                  onClick={handleExportPDF}
                >
                  Exportar PDF
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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

export default ActiveShiftModal;
