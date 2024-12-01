const Closure = require('../models/Closure');
const Sale = require('../models/Sale');
const Withdrawal = require('../models/Withdrawal');
const Fund = require('../models/Fund');
const { Sequelize } = require('sequelize');
const { Op } = Sequelize;

exports.getClosures = async (req, res) => {
  try {
    const closures = await Closure.findAll();
    res.json(closures);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cierres', details: error });
  }
};

exports.addClosure = async (req, res) => {
  try {
    const { tipo, fecha, total_ventas, total_retiros, efectivo_caja, total_final } = req.body;
    const newClosure = await Closure.create({ tipo, fecha, total_ventas, total_retiros, efectivo_caja, total_final });
    res.json(newClosure);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar cierre', details: error });
  }
};

exports.getPartialClosure = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    console.log('Rango de fechas:', startOfDay, endOfDay);

    // Fondos
    const fondos = await Fund.findAll({
      where: {
        fecha: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const fondoInicial = fondos.reduce((sum, fondo) => sum + parseFloat(fondo.monto), 0);

    // Ventas por método de pago
    const ventasPorMetodo = await Sale.findAll({
      attributes: [
        'metodo_pago_id',
        [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
      ],
      where: {
        fecha: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      group: ['metodo_pago_id'],
      raw: true,
    });

    const ventasEfectivo = ventasPorMetodo.find((venta) => venta.metodo_pago_id === 1)?.total || 0;
    const totalVentasNumero = ventasPorMetodo.reduce((sum, venta) => sum + parseInt(venta.cantidad, 10), 0);
    const totalVentasMonto = ventasPorMetodo.reduce((sum, venta) => sum + parseFloat(venta.total), 0);

    // Retiros
    const retiros = await Withdrawal.findAll({
      where: {
        fecha: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const totalRetiros = retiros.reduce((sum, retiro) => sum + parseFloat(retiro.monto), 0);

    // Fondos separados por tipo (Caja y Cuenta)
    const fondoCaja = fondos
      .filter((fondo) => fondo.tipo === 'caja')
      .reduce((sum, fondo) => sum + parseFloat(fondo.monto), 0);

    const fondoCuenta = fondos
      .filter((fondo) => fondo.tipo === 'cuenta')
      .reduce((sum, fondo) => sum + parseFloat(fondo.monto), 0);

    const fondoFinal = parseFloat(fondoInicial) + parseFloat(ventasEfectivo) - parseFloat(totalRetiros);

    // Crear el cierre
    const newClosure = await Closure.create({
      tipo: 'X',
      fecha: new Date(),
      total_ventas: totalVentasMonto,
      total_retiros: totalRetiros,
      efectivo_caja: fondoInicial,
      total_final: fondoFinal,
    });

    // Respuesta con resumen completo
    res.status(200).json({
      closure: newClosure,
      summary: {
        fondoInicial: fondoInicial.toFixed(2),
        totalVentasNumero,
        totalVentasMonto: totalVentasMonto.toFixed(2),
        ventasEfectivo: parseFloat(ventasEfectivo).toFixed(2),
        totalRetiros: parseFloat(totalRetiros).toFixed(2),
        fondoFinal: fondoFinal.toFixed(2),
        fondoCaja: fondoCaja.toFixed(2),
        fondoCuenta: fondoCuenta.toFixed(2),
        ventasPorMetodo: ventasPorMetodo.map((venta) => ({
          metodo: venta.metodo_pago_id,
          total: parseFloat(venta.total).toFixed(2),
          cantidad: venta.cantidad,
        })),
        retiros: retiros.map((retiro) => ({
          descripcion: retiro.descripcion,
          monto: parseFloat(retiro.monto).toFixed(2),
        })),
        fondos: fondos.map((fondo) => ({
          descripcion: fondo.descripcion,
          monto: parseFloat(fondo.monto).toFixed(2),
        })),
      },
    });
  } catch (error) {
    console.error('Error generando el cierre parcial:', error);
    res.status(500).json({ error: 'Error generando el cierre parcial', details: error.message });
  }
};
