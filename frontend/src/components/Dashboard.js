
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalesModal from './SalesModal';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSalesModal, setShowSalesModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter((product) =>
      product.id.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProductToSale = (product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleConfirmSale = async (paymentMethod) => {
    try {
      const saleData = {
        products: selectedProducts,
        paymentMethod,
      };
      await axios.post('http://localhost:5000/api/sales', saleData);
      alert('Venta confirmada exitosamente');
      setSelectedProducts([]);
      setShowSalesModal(false);
    } catch (error) {
      console.error('Error confirmando la venta:', error);
      alert('Error al confirmar la venta');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <div className="mb-3">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowSalesModal(true)}
        >
          Nueva Venta
        </button>
        {/* <input
          type="text"
          className="form-control"
          placeholder="Buscar productos por ID..."
          value={searchTerm}
          onChange={handleSearch}
        /> */}
      </div>
      {/* <table className="table table-bordered">
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
                  Agregar a Venta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <SalesModal
        show={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        handleConfirm={handleConfirmSale}
      />
    </div>
  );
}

export default Dashboard;
