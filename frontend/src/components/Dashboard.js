import React, { useState, useEffect } from 'react';
import { getProducts, createSale, downloadDailyReport } from '../services/api';
import ProductTable from '../components/ProductTable';
import SalesModal from '../components/SalesModal';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleConfirm = (paymentMethod) => {
    const sale = {
      products: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price,
        quantity: product.quantity,
        total: product.quantity * (paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price),
      })),
      paymentMethod,
      total: selectedProducts.reduce((sum, product) => {
        const price = paymentMethod === 'App Delivery' ? product.priceAlt || product.price : product.price;
        return sum + price * product.quantity;
      }, 0),
      date: new Date().toISOString(),
    };
  
    createSale(sale)
      .then(() => {
        alert('Venta registrada con éxito');
        setSelectedProducts([]); // Vaciar los productos seleccionados
      })
      .catch((error) => console.error('Error al registrar la venta:', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Punto de Venta</h1>
      
      <ProductTable
        products={products}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
      <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
        Finalizar Venta
      </button>
      <SalesModal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}

export default Dashboard;