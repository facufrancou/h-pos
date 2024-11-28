import React, { useState, useEffect } from 'react';

function SalesModal({ show, onClose, selectedProducts, setSelectedProducts, handleConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [total, setTotal] = useState(0);
  const [showCustomProductModal, setShowCustomProductModal] = useState(false); // Estado para el modal de producto personalizado
  const [customProduct, setCustomProduct] = useState({ description: '', amount: '' }); // Estado del producto personalizado

  // Recalcula el total dinámicamente cuando cambian los productos o el método de pago
  useEffect(() => {
    const calculatedTotal = selectedProducts.reduce((sum, product) => {
      const price = paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price;
      return sum + price * product.quantity;
    }, 0);
    setTotal(calculatedTotal);
  }, [paymentMethod, selectedProducts]);

  // Actualiza la cantidad de un producto o lo elimina si la cantidad es 0
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedProducts(selectedProducts.filter((product) => product.id !== productId)); // Elimina el producto
    } else {
      setSelectedProducts(
        selectedProducts.map((product) =>
          product.id === productId ? { ...product, quantity: newQuantity } : product
        )
      ); // Actualiza la cantidad del producto
    }
  };

  // Agregar Producto Personalizado
  const addCustomProduct = () => {
    if (!customProduct.description || !customProduct.amount || parseFloat(customProduct.amount) <= 0) {
      alert('Por favor, ingrese una descripción válida y un monto mayor a 0.');
      return;
    }
    const newProduct = {
      id: '000',
      name: customProduct.description,
      price: parseFloat(customProduct.amount),
      priceAlt: parseFloat(customProduct.amount),
      quantity: 1,
    };
    setSelectedProducts([...selectedProducts, newProduct]);
    setCustomProduct({ description: '', amount: '' }); // Limpiar campos
    setShowCustomProductModal(false); // Cerrar modal
  };

  // Confirma la venta
  const confirmSale = () => {
    if (!paymentMethod) {
      alert('Por favor, selecciona una condición de venta');
      return;
    }
    handleConfirm(paymentMethod); // Llama a la función para manejar la venta
    onClose(); // Cierra el modal
  };

  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Confirmar Venta</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Detalle de productos */}
              <h6>Detalle de Productos:</h6>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => {
                    const unitPrice =
                      paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price;
                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={product.quantity}
                            min="0"
                            onChange={(e) =>
                              updateQuantity(product.id, parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </td>
                        <td>${unitPrice}</td>
                        <td>${unitPrice * product.quantity}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateQuantity(product.id, 0)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <br/>

              {/* Botón para Producto Personalizado */}
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowCustomProductModal(true)}
              >
                Producto Personalizado
              </button>
              <br/>
              <p></p>
              {/* Total General */}
              <h5>
                Total: ${total}{' '}
                {paymentMethod === 'App Delivery' && (
                  <small className="text-muted">
                    (Precio normal: $
                    {selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)})
                  </small>
                )}
              </h5>
              <hr />

              {/* Selección de Método de Pago */}
              <h6>Selecciona la condición de venta:</h6>
              <div>
                {['Debito', 'Credito', 'Transferencia', 'Efectivo', 'App Delivery'].map((method) => (
                  <div className="form-check" key={method}>
                    <input
                      type="radio"
                      id={method}
                      name="paymentMethod"
                      className="form-check-input"
                      value={method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor={method} className="form-check-label">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary btn-sm" onClick={confirmSale}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Producto Personalizado */}
      {showCustomProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Agregar Producto Personalizado</h5>
                <button className="btn-close" onClick={() => setShowCustomProductModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Descripción del Producto"
                  value={customProduct.description}
                  onChange={(e) => setCustomProduct({ ...customProduct, description: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Monto Total"
                  value={customProduct.amount}
                  onChange={(e) => setCustomProduct({ ...customProduct, amount: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={addCustomProduct}>
                  Agregar
                </button>
                <button className="btn btn-secondary" onClick={() => setShowCustomProductModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SalesModal;
