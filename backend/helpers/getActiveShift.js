const Shift = require('../models/Shift');

const getActiveShift = async () => {
  const activeShift = await Shift.findOne({ where: { activo: true } });
  if (!activeShift) {
    throw new Error('No hay un turno activo.');
  }
  return activeShift;
};

module.exports = getActiveShift;
