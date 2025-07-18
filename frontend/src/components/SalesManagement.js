import React, { useState, useEffect } from "react";
import axios from "axios";
import { showAviso } from "../utils/printExportUtils";

// Mapeo de medios de pago
const paymentMethods = {
  1: "Efectivo",
  2: "Transferencia",
  3: "Tarjeta de Débito",
  4: "Tarjeta de Crédito",
  5: "App Delivery",
};

function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filterDates, setFilterDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDailySales();
  }, []);

  const fetchDailySales = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/sales?daily=true"
      );
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (error) {
      console.error("Error fetching daily sales:", error);
    }
  };

  const fetchSalesByDate = async (startDate, endDate) => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales", {
        params: { startDate, endDate },
      });
      setFilteredSales(response.data);
    } catch (error) {
      console.error("Error fetching sales by date:", error);
    }
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    if (!filterDates.startDate || !filterDates.endDate) {
      showAviso("Por favor seleccione un rango de fechas válido.");
      return;
    }
    fetchSalesByDate(filterDates.startDate, filterDates.endDate);
    setCurrentPage(1); // Resetear a la primera página cuando se aplica filtro
  };

  const handleShowDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Resetear a la primera página cuando se busca
  };
  
  // Filtrar ventas según el término de búsqueda
  const searchFilteredSales = filteredSales.filter((sale) => {
    if (!searchTerm) return true;
    
    return (
      sale.id.toString().includes(searchTerm) ||
      (sale.cliente && sale.cliente.nombre && sale.cliente.nombre.toLowerCase().includes(searchTerm)) ||
      (sale.cliente && sale.cliente.apellido && sale.cliente.apellido.toLowerCase().includes(searchTerm)) ||
      (paymentMethods[sale.metodo_pago_id] && paymentMethods[sale.metodo_pago_id].toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="container mt-4">
      <h1>Gestión de Ventas</h1>

      <form className="mb-3" onSubmit={handleDateFilter}>
        <div className="row g-3 align-items-end">
          <div className="col-auto">
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              className="form-control"
              value={filterDates.startDate}
              onChange={(e) =>
                setFilterDates({ ...filterDates, startDate: e.target.value })
              }
            />
          </div>
          <div className="col-auto">
            <label className="form-label">Fecha Fin</label>
            <input
              type="date"
              className="form-control"
              value={filterDates.endDate}
              onChange={(e) =>
                setFilterDates({ ...filterDates, endDate: e.target.value })
              }
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              Filtrar
            </button>
          </div>
        </div>
      </form>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID, cliente o método de pago..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Medio de Pago</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchFilteredSales
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{new Date(sale.fecha).toLocaleString()}</td>
                <td>${sale.total}</td>
                <td>{paymentMethods[sale.metodo_pago_id] || "Desconocido"}</td>
                <td>
                  {sale.cliente
                    ? `${sale.cliente.nombre} ${sale.cliente.apellido}`
                    : "No registrado"}
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleShowDetails(sale)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      {searchFilteredSales.length > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>
            
            {Array.from({ length: Math.ceil(searchFilteredSales.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(searchFilteredSales.length / itemsPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(searchFilteredSales.length / itemsPerPage)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {showDetailModal && selectedSale && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Detalle de la Venta</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h6>Información General</h6>
                <p>
                  <strong>ID Venta:</strong> {selectedSale.id}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(selectedSale.fecha).toLocaleString()}
                </p>
                <p>
                  <strong>Monto Total:</strong> ${selectedSale.total}
                </p>
                <p>
                  <strong>Medio de Pago:</strong>{" "}
                  {paymentMethods[selectedSale.metodo_pago_id] || "Desconocido"}
                </p>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {selectedSale.cliente
                    ? `${selectedSale.cliente.nombre} ${selectedSale.cliente.apellido}`
                    : "No registrado"}
                </p>

                <h6>Productos Vendidos</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.productos.map((producto, index) => (
                      <tr key={index}>
                        <td>
                          {producto.producto
                            ? producto.producto.nombre
                            : "Producto eliminado"}
                        </td>
                        <td>{producto.cantidad}</td>
                        <td>
                          $
                          {producto.precio_unitario
                            ? parseFloat(producto.precio_unitario).toFixed(2)
                            : "0.00"}
                        </td>
                        <td>
                          $
                          {producto.precio_unitario
                            ? (
                                producto.cantidad *
                                parseFloat(producto.precio_unitario)
                              ).toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
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

export default SalesManagement;
