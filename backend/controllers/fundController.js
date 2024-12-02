const Fund = require('../models/Fund');
const getActiveShift = require('../helpers/getActiveShift');

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
    const { descripcion, monto } = req.body;

    if (!descripcion || !monto) {
      return res.status(400).json({ error: 'Descripción y monto son obligatorios.' });
    }

    // Obtener el turno activo
    const activeShift = await getActiveShift();

    // Registrar el fondo asociado al turno activo
    const newFund = await Fund.create({
      turno_id: activeShift.id, // Asociar el fondo al turno activo
      fecha: new Date(),
      descripcion,
      monto,
    });

    res.status(201).json({ message: 'Fondo registrado correctamente', fondo: newFund });
  } catch (error) {
    console.error('Error al registrar fondo:', error);
    res.status(500).json({ error: 'Error al registrar fondo', details: error.message });
  }
};