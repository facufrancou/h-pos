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
        { 
          model: Client, 
          as: 'cliente',
          attributes: ['id', 'nombre', 'apellido'] // Campos del cliente
        },
        {
          model: SaleProduct,
          as: 'productos',
          attributes: ['id', 'cantidad', 'precio_unitario', 'total'], // Campos de la relación productos_en_ventas
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['id', 'nombre'] // Campos del producto
            }
          ]
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
  const { cliente_id, metodo_pago_id, productos } = req.body;

  try {
    // Calcular el total y los puntos ganados
    const total = productos.reduce((sum, p) => sum + p.total, 0);
    const puntosGanados = productos.reduce((sum, p) => sum + (p.puntos_suma * p.cantidad), 0);
   

    // Crear la venta
    const newSale = await Sale.create({
      cliente_id,
      metodo_pago_id,
      total,
      puntos_ganados: puntosGanados, // Guardar los puntos ganados
    });

    // Asociar productos a la venta
    for (const product of productos) {
      await SaleProduct.create({
        venta_id: newSale.id,
        producto_id: product.id,
        cantidad: product.cantidad,
        precio_unitario: product.precio_unitario,
        total: product.cantidad * product.precio_unitario,
      });
    }

    // Acumular puntos si hay cliente asociado
    if (cliente_id) {
      const cliente = await Client.findByPk(cliente_id);
      if (cliente) {
        cliente.puntos_acumulados += puntosGanados; // Sumar puntos al cliente
        await cliente.save(); // Guardar los cambios
      }
    }

    res.status(201).json({ message: 'Venta registrada exitosamente', venta: newSale });
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ error: 'Error al registrar la venta', details: error });
  }
};