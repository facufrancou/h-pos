const Withdrawal = require('../models/Withdrawal');

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
    const { fecha, descripcion, monto } = req.body;
    const newWithdrawal = await Withdrawal.create({ fecha, descripcion, monto });
    res.json(newWithdrawal);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar retiro', details: error });
  }
};
