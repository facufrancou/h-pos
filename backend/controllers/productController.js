const Product = require('../models/Product');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error });
  }
};

// Agregar un nuevo producto
exports.addProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, precio_alternativo, puntos_suma, cantidad_stock } = req.body;

    const newProduct = await Product.create({
      nombre,
      descripcion,
      precio,
      precio_alternativo,
      puntos_suma,
      cantidad_stock,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto', details: error });
  }
};

// Actualizar un producto existente
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, precio_alternativo, puntos_suma, cantidad_stock } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    product.nombre = nombre || product.nombre;
    product.descripcion = descripcion || product.descripcion;
    product.precio = precio || product.precio;
    product.precio_alternativo = precio_alternativo || product.precio_alternativo;
    product.puntos_suma = puntos_suma || product.puntos_suma;
    product.cantidad_stock = cantidad_stock || product.cantidad_stock;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', details: error });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await product.destroy();

    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', details: error });
  }
};
