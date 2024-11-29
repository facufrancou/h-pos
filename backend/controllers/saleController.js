const Sale = require('../models/Sale');
const Client = require('../models/Client');
const Product = require('../models/Product');
const SaleProduct = require('../models/SaleProduct');
const { Op } = require('sequelize'); // Para operadores de Sequelize


exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log('Fechas recibidas:', startDate, endDate);

    // Construir condiciones de búsqueda con rango de tiempo completo
    const where = {};
    if (startDate && endDate) {
      where.fecha = {
        [Op.between]: [
          new Date(`${startDate}T00:00:00`), // Inicio del día
          new Date(`${endDate}T23:59:59`)   // Fin del día
        ]
      };
    }

    const sales = await Sale.findAll({
      where,
      include: [
        { model: Client, as: 'cliente' },
        {
          model: SaleProduct,
          as: 'productos',
          include: [{ model: Product, as: 'producto' }]
        }
      ]
    });

    res.json(sales);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas', details: error });
  }
};
// Crear una nueva venta
exports.createSale = async (req, res) => {
  try {
    const { cliente_id,metodo_pago_id, total, productos } = req.body;

    const sale = await Sale.create({ cliente_id, metodo_pago_id, total });

    for (const producto of productos) {
      await SaleProduct.create({
        venta_id: sale.id,
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
        total: producto.total,
      });
    }

    res.status(201).json({ message: 'Venta registrada con éxito', sale });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la venta', details: error });
  }
};
