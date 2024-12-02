const Shift = require('../models/Shift');
const Sale = require('../models/Sale');
const Withdrawal = require('../models/Withdrawal');
const Fund = require('../models/Fund');


exports.getActiveShift = async (req, res) => {
    try {
        const activeShift = await Shift.findOne({ where: { estado: 'abierto' } });
        if (!activeShift) {
            return res.status(404).json({ error: 'No hay un turno activo' });
        }
        res.json(activeShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener turno activo' });
    }
};

// Iniciar turno
exports.startShift = async (req, res) => {
    try {
      const { usuario, fondo_inicial } = req.body;
  
      if (!usuario || !fondo_inicial) {
        return res.status(400).json({ error: 'Usuario y fondo inicial son obligatorios.' });
      }
  
      const activeShift = await Shift.findOne({ where: { activo: true } });
      if (activeShift) {
        return res.status(400).json({ error: 'Ya existe un turno activo.' });
      }
  
      const newShift = await Shift.create({ usuario, fondo_inicial, activo: true });
      res.status(201).json(newShift);
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar turno', details: error });
    }
  };
  
  
  // Cerrar turno
  exports.closeShift = async (req, res) => {
    try {
      const { fondo_final } = req.body;
      const activeShift = await Shift.findOne({ where: { activo: true } });
  
      if (!activeShift) {
        return res.status(400).json({ error: 'No hay un turno activo para cerrar.' });
      }
  
      activeShift.fondo_final = fondo_final;
      activeShift.activo = false;
      await activeShift.save();
  
      res.status(200).json({ message: 'Turno cerrado exitosamente', shift: activeShift });
    } catch (error) {
      res.status(500).json({ error: 'Error al cerrar turno', details: error });
    }
  };
