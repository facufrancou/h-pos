const Closure = require('../models/Closure');

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
