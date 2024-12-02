const Withdrawal = require('../models/Withdrawal');
const getActiveShift = require('../helpers/getActiveShift');

exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.findAll();
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener retiros', details: error });
  }
};

exports.addWithdrawal = async (req, res) => {
  try {
    const { descripcion, monto } = req.body;

    if (!descripcion || !monto) {
      return res.status(400).json({ error: 'Descripción y monto son obligatorios.' });
    }

    // Obtener el turno activo
    const activeShift = await getActiveShift();

    // Registrar el retiro asociado al turno activo
    const newWithdrawal = await Withdrawal.create({
      turno_id: activeShift.id, // Asociar el retiro al turno activo
      fecha: new Date(),
      descripcion,
      monto,
    });

    res.status(201).json({ message: 'Retiro registrado correctamente', retiro: newWithdrawal });
  } catch (error) {
    console.error('Error al registrar retiro:', error);
    res.status(500).json({ error: 'Error al registrar retiro', details: error.message });
  }
};