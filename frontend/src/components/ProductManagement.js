import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showAviso } from '../utils/printExportUtils';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    precio_alternativo: '',
    puntos_suma: '',
    cantidad_stock: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = () => {
    setForm({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      precio_alternativo: '',
      puntos_suma: '',
      cantidad_stock: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
        showAviso('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${form.id}`, form);
        showAviso('Producto actualizado exitosamente');
      } else {
        await axios.post('http://localhost:5000/api/products', form);
        showAviso('Producto agregado exitosamente');
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Filtrar productos solo por ID
  const filteredProducts = products.filter((product) =>
    searchTerm ? product.id.toString() === searchTerm : true
  );

  return (
    <div className="container mt-4">
      <h1>Gestión de Productos</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos por ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-primary mt-3" onClick={handleAdd}>
          Agregar Producto
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Precio Alternativo</th>
            <th>Puntos</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {filteredProducts.slice(0, 5).map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>${product.precio}</td>
              <td>${product.precio_alternativo}</td>
              <td>{product.puntos_suma}</td>
              <td>{product.cantidad_stock}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.precio}
                      onChange={(e) => setForm({ ...form, precio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio Alternativo</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.precio_alternativo}
                      onChange={(e) => setForm({ ...form, precio_alternativo: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puntos</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.puntos_suma}
                      onChange={(e) => setForm({ ...form, puntos_suma: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.cantidad_stock}
                      onChange={(e) => setForm({ ...form, cantidad_stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
