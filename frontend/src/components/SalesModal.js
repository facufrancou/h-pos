import React, { useState, useEffect } from "react";
import axios from "axios";
import ClientSearchModal from "./ClientSearchModal"; // Modal para buscar clientes

function SalesModal({ show, onClose, selectedProducts, setSelectedProducts }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [clientId, setClientId] = useState("");
  const [total, setTotal] = useState(0);
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

  const filterProducts = () => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) =>
        product.id.toString().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddProductToSale = (product) => {
    const isAppDelivery = paymentMethod === "5"; // ID de "App Delivery"
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
                quantity: p.quantity + 1,
                total: (p.quantity + 1) * price,
              }
            : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
          precio_unitario: price,
          total: price,
        },
      ]);
    }
  };

  const handleRemoveProductFromSale = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Evita cantidades negativas o cero
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

  const handleFinalizeSale = async () => {
    if (!paymentMethod) {
      alert('Por favor seleccione un método de pago.');
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
        puntos_suma: product.puntos_suma, // Verifica que esto esté definido
      })),
    };
  
    try {
      await axios.post('http://localhost:5000/api/sales', saleData);
      alert('Venta confirmada exitosamente');
      // Reiniciar estados del modal
      setSelectedProducts([]);
      setPaymentMethod('');
      setClientId('');
      onClose();
    } catch (error) {
      console.error('Error confirmando la venta:', error);
      alert('Error al confirmar la venta');
    }
  };

  const fetchClientPoints = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
      alert(`Puntos acumulados: ${response.data.puntos_acumulados}`);
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

  if (!show) return null;


  return (
    <>
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nueva Venta</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar productos por ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {filteredProducts.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.nombre}</td>
                        <td>${product.precio}</td>
                        <td>{product.cantidad_stock}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAddProductToSale(product)}
                          >
                            Agregar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <h5>Productos Seleccionados</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id}>
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
                      <td>${(product.total || 0).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleRemoveProductFromSale(product.id)
                          }
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3">
                <label htmlFor="clientId" className="form-label">
                  Cliente (opcional):
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    id="clientId"
                    className="form-control"
                    placeholder="ID del cliente"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleOpenClientModal}
                  >
                    Buscar Cliente
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="paymentMethod" className="form-label">
                  Seleccionar Método de Pago:
                </label>
                <select
                  id="paymentMethod"
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">-- Seleccione --</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <h5 className="mt-3">Total: ${total.toFixed(2)}</h5>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleFinalizeSale}>
                Finalizar Venta
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
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
