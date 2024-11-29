const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/db.json');

exports.getProducts = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  res.json(db.products);
};

// Agregar producto
exports.addProduct = (req, res) => {
  const { id, name, price, priceAlt } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));
  
  // Validar duplicados
  if (db.products.some(product => product.id === id)) {
    return res.status(400).json({ message: 'El ID del producto ya existe.' });
  }

  db.products.push({ id, name, price, priceAlt });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({ message: 'Producto agregado exitosamente.' });
};

// Actualizar producto
exports.updateProduct = (req, res) => {
  const { id, name, price, priceAlt } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));

  const productIndex = db.products.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  db.products[productIndex] = { id, name, price, priceAlt };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json({ message: 'Producto actualizado exitosamente.' });
};

// Eliminar producto
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(dbPath));

  db.products = db.products.filter(product => product.id !== parseInt(id, 10));
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json({ message: 'Producto eliminado exitosamente.' });
};
