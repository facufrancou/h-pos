const Fund = require('../models/Fund');

exports.getFunds = async (req, res) => {
  try {
    const funds = await Fund.findAll();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fondos', details: error });
  }
};

exports.addFund = async (req, res) => {
  try {
    const { fecha, descripcion, monto } = req.body;
    const newFund = await Fund.create({ fecha, descripcion, monto });
    res.json(newFund);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar fondo', details: error });
  }
};
