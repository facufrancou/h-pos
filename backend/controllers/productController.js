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
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    }
    
    if (precio === undefined || precio === null || isNaN(parseFloat(precio))) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }
    
    if (cantidad_stock === undefined || cantidad_stock === null || isNaN(parseInt(cantidad_stock))) {
      return res.status(400).json({ error: 'La cantidad en stock debe ser un número válido' });
    }
    
    // Convertir valores a los tipos correctos
    const productData = {
      nombre,
      descripcion: descripcion || '',
      precio: parseFloat(precio),
      precio_alternativo: precio_alternativo !== null && precio_alternativo !== undefined && !isNaN(parseFloat(precio_alternativo)) 
        ? parseFloat(precio_alternativo) 
        : null,
      puntos_suma: puntos_suma !== null && puntos_suma !== undefined && !isNaN(parseInt(puntos_suma)) 
        ? parseInt(puntos_suma) 
        : 0,
      cantidad_stock: parseInt(cantidad_stock)
    };
    
    console.log('Datos del producto a crear:', productData);
    
    const newProduct = await Product.create(productData);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al agregar producto', 
      details: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    }
    
    if (precio === undefined || precio === null || isNaN(parseFloat(precio))) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }
    
    if (cantidad_stock === undefined || cantidad_stock === null || isNaN(parseInt(cantidad_stock))) {
      return res.status(400).json({ error: 'La cantidad en stock debe ser un número válido' });
    }

    // Actualizar propiedades con conversión de tipos
    product.nombre = nombre;
    product.descripcion = descripcion || '';
    product.precio = parseFloat(precio);
    product.precio_alternativo = precio_alternativo !== null && precio_alternativo !== undefined && !isNaN(parseFloat(precio_alternativo)) 
      ? parseFloat(precio_alternativo) 
      : null;
    product.puntos_suma = puntos_suma !== null && puntos_suma !== undefined && !isNaN(parseInt(puntos_suma)) 
      ? parseInt(puntos_suma) 
      : 0;
    product.cantidad_stock = parseInt(cantidad_stock);

    console.log('Datos del producto a actualizar:', product.toJSON());
    
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar producto', 
      details: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
