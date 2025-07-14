import React, { useState, useEffect } from "react";
import axios from "axios";
import ClientSearchModal from "./ClientSearchModal"; // Modal para buscar clientes
import { showAviso } from "../utils/printExportUtils";

function SalesModal({ show, onClose, selectedProducts, setSelectedProducts, onSaleRegistered }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("1"); // Por defecto efectivo
  const [clientId, setClientId] = useState("");
  const [total, setTotal] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const paymentMethods = [
    { id: 1, nombre: "Efectivo" },
    { id: 2, nombre: "Transferencia" },
    { id: 3, nombre: "Tarjeta de Débito" },
    { id: 4, nombre: "Tarjeta de Crédito" },
    { id: 5, nombre: "App Delivery" },
  ];

  useEffect(() => {
    if (show) {
      fetchProducts();
      calculateTotal();
    }
  }, [show, selectedProducts]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  useEffect(() => {
    const isAppDelivery = paymentMethod === "5"; // ID de "App Delivery"
    // Actualizar precios de los productos seleccionados
    setSelectedProducts((prev) =>
      prev.map((p) => ({
        ...p,
        precio_unitario: isAppDelivery
          ? parseFloat(p.precio_alternativo || 0)
          : parseFloat(p.precio || 0),
        total: p.quantity * (isAppDelivery
          ? parseFloat(p.precio_alternativo || 0)
          : parseFloat(p.precio || 0)),
      }))
    );
  }, [paymentMethod]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Búsqueda por nombre y autocompletar
  const filterProducts = () => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter((product) =>
        product.nombre.toLowerCase().includes(term) || product.id.toString().includes(term)
      );
      setFilteredProducts(filtered);
    }
  };

  // Botón rápido para agregar cantidad personalizada
  const handleAddProductToSale = (product, cantidad = 1) => {
    const isAppDelivery = paymentMethod === "5";
    const price = isAppDelivery
      ? parseFloat(product.precio_alternativo || 0)
      : parseFloat(product.precio || 0);
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + cantidad,
                total: (p.quantity + cantidad) * price,
              }
            : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          ...product,
          quantity: cantidad,
          precio_unitario: price,
          total: cantidad * price,
        },
      ]);
    }
  };

  const handleRemoveProductFromSale = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Edición directa de cantidad
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: newQuantity,
              total: newQuantity * parseFloat(p.precio_unitario),
            }
          : p
      )
    );
  };

  const calculateTotal = () => {
    const totalAmount = selectedProducts.reduce(
      (sum, product) => sum + (product.total || 0),
      0
    );
    setTotal(totalAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedProducts]);

  // Mostrar resumen antes de finalizar
  const handleFinalizeSale = async () => {
    setShowSummary(true);
  };

  const handleConfirmSale = async () => {
    if (!paymentMethod) {
      showAviso('Por favor seleccione un método de pago.');
      return;
    }
    const saleData = {
      cliente_id: clientId || null,
      metodo_pago_id: paymentMethod,
      total,
      productos: selectedProducts.map((product) => ({
        id: product.id,
        cantidad: product.quantity,
        precio_unitario: product.precio_unitario,
        total: product.total,
        puntos_suma: product.puntos_suma,
      })),
    };
    try {
      await axios.post('http://localhost:5000/api/sales', saleData);
      showAviso('Venta confirmada exitosamente');
      setSelectedProducts([]);
      setPaymentMethod('1');
      setClientId('');
      setShowSummary(false);
      if (typeof onSaleRegistered === 'function') onSaleRegistered();
      onClose();
    } catch (error) {
      console.error('Error confirmando la venta:', error);
      showAviso('Error al confirmar la venta');
    }
  };

  const fetchClientPoints = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
      showAviso(`Puntos acumulados: ${response.data.puntos_acumulados}`);
    } catch (error) {
      console.error("Error fetching client points:", error);
    }
  };
  
  // Llamar esta función después de confirmar la venta
  if (clientId) {
    fetchClientPoints(clientId);
  }

  const handleOpenClientModal = () => {
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
  };

  const handleSelectClient = (client) => {
    setClientId(client.id);
    handleCloseClientModal();
  };

  // Limpiar formulario al cerrar el modal
  const handleCloseModal = () => {
    setSelectedProducts([]);
    setPaymentMethod('1');
    setClientId('');
    setShowSummary(false);
    onClose();
  };
  if (!show) return null;

  // Productos frecuentes (más vendidos o recientes)
  const productosFrecuentes = products.slice(0, 5); // Simulación: los primeros 5

  return (
    <>
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-shopping-cart me-2"></i> Nueva Venta
              </h5>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body" style={{ background: "#f8f9fa" }}>
              {/* Productos frecuentes */}
              <div className="mb-2">
                <span className="fw-bold">Productos frecuentes:</span>
                <div className="d-flex gap-2 flex-wrap mt-1">
                  {productosFrecuentes.map((product) => (
                    <button key={product.id} className="btn btn-outline-secondary btn-sm" onClick={() => handleAddProductToSale(product)}>
                      {product.nombre}
                    </button>
                  ))}
                </div>
              </div>
              {/* Buscador de productos */}
              <div className="card mb-3 shadow-sm" style={{maxHeight: '350px', overflowY: 'auto'}}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-search me-2 text-secondary"></i>
                    <span className="fw-bold">Buscar productos</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar productos por nombre o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {/* Autocompletar */}
                  {searchTerm.trim() !== "" ? (
                    filteredProducts.length > 0 ? (
                      <table className="table table-bordered mt-3">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, idx) => (
                            <tr key={product.id} className={idx % 2 === 0 ? "table-light" : ""}>
                              <td>{product.id}</td>
                              <td>{product.nombre}</td>
                              <td>${product.precio}</td>
                              <td>
                                {/* Resaltado de stock bajo */}
                                <span className={product.cantidad_stock <= 5 ? "badge bg-danger" : ""}>{product.cantidad_stock}</span>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <button className="btn btn-success btn-sm" onClick={() => handleAddProductToSale(product, 1)}>
                                    +1
                                  </button>
                                  <button className="btn btn-info btn-sm" onClick={() => handleAddProductToSale(product, 5)}>
                                    +5
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="alert alert-warning mt-3 d-flex align-items-center" role="alert">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        No se encontraron productos que coincidan con la búsqueda.
                      </div>
                    )
                  ) : null}
                </div>
              </div>

              {/* Productos seleccionados */}
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-box-open me-2 text-secondary"></i>
                    <span className="fw-bold">Productos Seleccionados</span>
                  </div>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.length === 0 ? (
                        <tr><td colSpan="4" className="text-center text-muted">No hay productos seleccionados.</td></tr>
                      ) : (
                        selectedProducts.map((product, idx) => (
                          <tr key={product.id} className={idx % 2 === 0 ? "table-light" : ""}>
                            <td>{product.nombre}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                style={{ width: "70px" }}
                                value={product.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product.id,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                              />
                            </td>
                            <td><span className="badge bg-info">${(product.total || 0).toFixed(2)}</span></td>
                            <td>
                              <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={() => handleRemoveProductFromSale(product.id)}>
                                <i className="fas fa-trash me-1"></i> Quitar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cliente y método de pago */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-user me-2 text-secondary"></i>
                        <span className="fw-bold">Cliente (opcional)</span>
                      </div>
                      <div className="input-group">
                        <input
                          type="text"
                          id="clientId"
                          className="form-control"
                          placeholder="ID del cliente (opcional)"
                          value={clientId}
                          onChange={(e) => setClientId(e.target.value)}
                        />
                        <button className="btn btn-primary d-flex align-items-center" onClick={handleOpenClientModal}>
                          <i className="fas fa-search me-1"></i> Buscar Cliente
                        </button>
                      </div>
                      <div className="form-text">Si no se ingresa cliente, se registra como venta rápida.</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-credit-card me-2 text-secondary"></i>
                        <span className="fw-bold">Método de Pago</span>
                      </div>
                      <select
                        id="paymentMethod"
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.nombre}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">Por defecto: Efectivo</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="card mt-3 shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <span className="fw-bold fs-5"><i className="fas fa-dollar-sign me-2 text-success"></i> Total:</span>
                  <span className="badge bg-success fs-5">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary d-flex align-items-center" onClick={handleFinalizeSale}>
                <i className="fas fa-check me-2"></i> Finalizar Venta
              </button>
              <button className="btn btn-secondary d-flex align-items-center" onClick={handleCloseModal}>
                <i className="fas fa-times me-2"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de resumen antes de confirmar */}
      {showSummary && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">Resumen de la Venta</h5>
                <button className="btn-close" onClick={() => setShowSummary(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Cliente:</strong> {clientId ? clientId : 'Venta rápida (sin cliente)'}</p>
                <p><strong>Método de Pago:</strong> {paymentMethods.find(m => m.id.toString() === paymentMethod)?.nombre}</p>
                <p><strong>Total:</strong> ${total.toFixed(2)}</p>
                <h6>Productos:</h6>
                <ul>
                  {selectedProducts.map((p) => (
                    <li key={p.id}>{p.nombre} x{p.quantity} = ${p.total.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleConfirmSale}>Confirmar y Registrar</button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showClientModal && (
        <ClientSearchModal
          show={showClientModal}
          onClose={handleCloseClientModal}
          onSelectClient={handleSelectClient}
        />
      )}
    </>
  );
}

export default SalesModal;
