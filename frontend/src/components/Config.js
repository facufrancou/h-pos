import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

function Config() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    priceAlt: "",
  });
  const [newId, setNewId] = useState(null); // Nuevo estado para mostrar el ID generado

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleSubmit = async () => {
    if (form.id) {
      await updateProduct(form);
    } else {
      // Generar un nuevo ID basado en el producto con el ID más alto
      const generatedId = Math.max(...products.map((p) => p.id), 0) + 1;
      const newProduct = { ...form, id: generatedId };
      await addProduct(newProduct);
      setNewId(generatedId); // Guardar el nuevo ID para mostrarlo
    }
    setProducts(await getProducts());
    setForm({ id: "", name: "", price: "", priceAlt: "" });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(await getProducts());
  };

  // Filtrar productos por código en lugar de nombre
  const filteredProducts = products.filter((product) =>
    product.id.toString().includes(searchTerm)
  );

  return (
    <div className="container mt-5">
      <h1>Productos</h1>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto por código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sección del formulario */}
<div className="card mb-4 shadow-sm">
  <div className="card-header bg-primary text-white">
    {form.id ? 'Editar Producto' : 'Agregar Producto'}
  </div>
  <div className="card-body">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="productName" className="form-label">Nombre</label>
          <input
            type="text"
            id="productName"
            className="form-control"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="productPrice" className="form-label">Precio</label>
          <input
            type="number"
            id="productPrice"
            className="form-control"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="productPriceAlt" className="form-label">Precio Alternativo</label>
          <input
            type="number"
            id="productPriceAlt"
            className="form-control"
            placeholder="Precio Alternativo"
            value={form.priceAlt}
            onChange={(e) => setForm({ ...form, priceAlt: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12 text-end">
          <button className="btn btn-primary">{form.id ? 'Actualizar' : 'Guardar'}</button>
        </div>
      </div>
    </form>

    {/* Mensaje dinámico para mostrar el código asignado */}
    {newId && (
      <div className="alert alert-success mt-3">
        <strong>¡Producto agregado exitosamente!</strong> Código asignado: <span className="fw-bold">{newId}</span>
      </div>
    )}
  </div>
</div>

      {/* Vista en tarjetas */}
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-md-3" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                  Código: {product.id} <br />
                  Precio: ${product.price} <br />
                  Precio Alternativo: ${product.priceAlt}
                </p>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setForm(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Config;
