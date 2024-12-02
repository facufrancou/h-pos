import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ActiveShiftModal() {
  const [shiftData, setShiftData] = useState(null); // Datos del turno activo
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [hasActiveShift, setHasActiveShift] = useState(false); // Estado de turno activo
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores

  // Verificar si hay un turno activo al cargar el componente
  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shifts/active');
        setHasActiveShift(!!response.data); // Si hay turno activo, cambiar a true
      } catch (err) {
        setHasActiveShift(false); // No hay turno activo
        console.error('Error al verificar turno activo:', err);
      }
    };

    checkActiveShift();
  }, []);

  // Función para obtener los datos del turno
  const fetchShiftDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/shifts/details');
      setShiftData(response.data); // Guardar los datos del turno
      setShowModal(true); // Mostrar el modal
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los datos del turno.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mostrar el botón solo si hay un turno activo */}
      {hasActiveShift && (
        <button
          className="btn btn-info"
          onClick={fetchShiftDetails}
        >
          Ver Turno Actual
        </button>
      )}

      {/* Modal de datos del turno */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Detalles del Turno en Curso</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <p>Cargando datos...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <>
                    <h6>Turno</h6>
                    <p><strong>ID:</strong> {shiftData.turno.id}</p>
                    <p><strong>Usuario:</strong> {shiftData.turno.usuario}</p>
                    <p><strong>Fondo Inicial:</strong> ${shiftData.turno.fondo_inicial}</p>
                    <p><strong>Fondo Final:</strong> {shiftData.turno.fondo_final || 'Aún no cerrado'}</p>
                    <p><strong>Inicio:</strong> {new Date(shiftData.turno.inicio).toLocaleString()}</p>
                    {shiftData.turno.cierre && (
                      <p><strong>Cierre:</strong> {new Date(shiftData.turno.cierre).toLocaleString()}</p>
                    )}

                    <h6 className="mt-4">Ventas</h6>
                    <p><strong>Total de Ventas:</strong> ${shiftData.ventas.total}</p>
                    <ul>
                      {shiftData.ventas.detalle.map((venta) => (
                        <li key={venta.id}>
                          Venta #{venta.id}: ${venta.total} - {new Date(venta.fecha).toLocaleString()}
                        </li>
                      ))}
                    </ul>

                    <h6 className="mt-4">Fondos</h6>
                    <p><strong>Total de Fondos:</strong> ${shiftData.fondos.total}</p>
                    <ul>
                      {shiftData.fondos.detalle.map((fondo) => (
                        <li key={fondo.id}>
                          {fondo.descripcion}: ${fondo.monto} - {new Date(fondo.fecha).toLocaleString()}
                        </li>
                      ))}
                    </ul>

                    <h6 className="mt-4">Retiros</h6>
                    <p><strong>Total de Retiros:</strong> ${shiftData.retiros.total}</p>
                    <ul>
                      {shiftData.retiros.detalle.map((retiro) => (
                        <li key={retiro.id}>
                          {retiro.descripcion}: ${retiro.monto} - {new Date(retiro.fecha).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="modal-footer">
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
