import React, { useState } from 'react';
import axios from 'axios';

function SalesByDate() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sales, setSales] = useState([]);

  const fetchSales = () => {
    // Llama al backend con el rango de fechas
    axios
      .get(`http://localhost:5000/sales/date-range`, {
        params: { startDate, endDate },
      })
      .then((response) => {
        setSales(response.data);
        console.log(startDate, endDate);
      })
      .catch((error) => {
        console.error('Error al obtener las ventas:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Ventas por Rango de Fechas</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <label htmlFor="startDate" className="form-label">Fecha de inicio</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="endDate" className="form-label">Fecha de fin</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 align-self-end">
          <button className="btn btn-primary w-100" onClick={fetchSales}>
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabla de ventas */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Método de Pago</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale, index) => (
              <tr key={index}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {sale.products.map((product, idx) => (
                      <li key={idx}>
                        ({product.quantity}) - {product.name} - ${product.total || (product.quantity * product.price)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{sale.paymentMethod}</td>
                <td>${sale.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No se encontraron ventas para el rango seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalesByDate;
