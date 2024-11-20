import React, { useState } from 'react';

function ProductTable({ products, selectedProducts, setSelectedProducts }) {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la barra de búsqueda

  // Filtrar productos por código si hay algo en el campo de búsqueda
  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.id.toString().includes(searchTerm)
      )
    : [];

  // Manejar cambio en la cantidad de productos
  const updateQuantity = (product, quantity) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      if (quantity > 0) {
        // Actualizar la cantidad si ya está seleccionado
        setSelectedProducts(
          selectedProducts.map((p) =>
            p.id === product.id ? { ...p, quantity } : p
          )
        );
      } else {
        // Eliminar del carrito si la cantidad es 0
        setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
      }
    } else {
      // Agregar al carrito con la cantidad especificada
      setSelectedProducts([...selectedProducts, { ...product, quantity }]);
    }
  };

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
        />
      </div>

      {/* Tabla de productos */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <input
                    type="number"
                    className="form-control-sm"
                    min="0"
                    value={
                      selectedProducts.find((p) => p.id === product.id)?.quantity || 0
                    }
                    onChange={(e) =>
                      updateQuantity(product, parseInt(e.target.value, 10) || 0)
                    }
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                {searchTerm ? 'No se encontraron productos.' : 'Ingresa un código para buscar.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
