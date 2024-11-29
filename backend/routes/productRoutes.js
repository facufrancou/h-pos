const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts); // Obtener todos los productos
router.post('/', addProduct); // Crear producto
router.put('/:id', updateProduct); // Actualizar producto
router.delete('/:id', deleteProduct); // Eliminar producto

module.exports = router;
