const express = require('express');
const { getProducts } = require('../controllers/productController');
const router = express.Router();
const { addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/add', addProduct); // Agregar producto
router.put('/update', updateProduct); // Actualizar producto
router.delete('/delete/:id', deleteProduct); // Eliminar producto

module.exports = router;