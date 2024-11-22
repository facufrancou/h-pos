import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HistoricalReports() {
  const [reportType, setReportType] = useState('sales'); // 'sales', 'withdrawals', 'closures'
  const [data, setData] = useState([]); // Inicializado como un array vacío
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [startDate, setStartDate] = useState(''); // Fecha de inicio
  const [endDate, setEndDate] = useState(''); // Fecha de fin

  const fetchReport = () => {
    setLoading(true);
    setError(null); // Reinicia el estado de error antes de la solicitud

    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    console.log(startDate)
    console.log(endDate)

    axios
      .get(`http://localhost:5000/sales/history/${reportType}`, { params })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data); // Asegúrate de que la respuesta sea un array
        } else {
          setData([]); // Si no es un array, inicializa como vacío
          console.error('La respuesta del backend no tiene el formato esperado:', response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el reporte:', error);
        setError('Error al cargar los datos. Intenta nuevamente.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate]); // Vuelve a cargar los datos cuando cambien las fechas o el tipo de reporte

  const renderTable = () => {
    if (loading) {
      return <p>Cargando...</p>;
    }

    if (error) {
      return <p className="text-danger">{error}</p>;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return <p>No hay datos disponibles.</p>;
    }

    switch (reportType) {
      case 'sales':
        return (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Total</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sale, index) => (
                <tr key={index}>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                  <td>{sale.shift}</td>
                  <td>${sale.total}</td>
                  <td>
                    <ul>
                      {Array.isArray(sale.products) &&
                        sale.products.map((product, idx) => (
                          <li key={idx}>
                            {product.quantity}x {product.name} (${product.price})
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'withdrawals':
        return (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Operador</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.map((withdrawal, index) => (
                <tr key={index}>
                  <td>{new Date(withdrawal.date).toLocaleString()}</td>
                  <td>{withdrawal.operator}</td>
                  <td>${withdrawal.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'closures':
        return (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Turno</th>
                <th>Fecha</th>
                <th>Total Ventas</th>
                <th>Total Retiros</th>
                <th>Final en Caja</th>
              </tr>
            </thead>
            <tbody>
              {data.map((closure, index) => (
                <tr key={index}>
                  <td>{closure.shift}</td>
                  <td>{new Date(closure.date).toLocaleString()}</td>
                  <td>${closure.totalSales}</td>
                  <td>${closure.totalWithdrawals}</td>
                  <td>${closure.finalCash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Reportes Históricos</h1>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">Fecha de inicio:</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">Fecha de fin:</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="reportType" className="form-label">Tipo de Reporte:</label>
          <select
            id="reportType"
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="sales">Ventas</option>
            <option value="withdrawals">Retiros</option>
            <option value="closures">Cierres</option>
          </select>
        </div>
      </div>
      {renderTable()}
    </div>
  );
}

export default HistoricalReports;
