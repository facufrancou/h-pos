const Shift = require('../models/Shift');
const Sale = require('../models/Sale');
const Fund = require('../models/Fund'); // Importa el modelo de fondos
const Withdrawal = require('../models/Withdrawal');



exports.getActiveShift = async (req, res) => {
    try {
        const activeShift = await Shift.findOne({ where: { activo: true } });
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

    // Verifica si ya hay un turno activo
    const activeShift = await Shift.findOne({ where: { activo: true } });
    if (activeShift) {
      return res.status(400).json({ error: 'Ya existe un turno activo.' });
    }

    // Crea el nuevo turno
    const newShift = await Shift.create({
      usuario,
      fondo_inicial,
      estado: 'abierto',
      activo: true,
      inicio: new Date(),
    });

    // Registra el fondo inicial en la tabla de fondos
    await Fund.create({
      turno_id: newShift.id, // Relaciona con el turno recién creado
      fecha: new Date(),
      descripcion: 'Fondo inicial al abrir caja',
      monto: fondo_inicial,
    });

    res.status(201).json({ message: 'Turno iniciado y fondo registrado correctamente', turno: newShift });
  } catch (error) {
    console.error('Error al iniciar turno:', error);
    res.status(500).json({ error: 'Error al iniciar turno', details: error });
  }
};

  
  // Cerrar turno
  exports.closeShift = async (req, res) => {
    try {
      const { fondo_final } = req.body;
  
      // Encuentra el turno activo
      const activeShift = await Shift.findOne({ where: { activo: true } });
      if (!activeShift) {
        return res.status(400).json({ error: 'No hay un turno activo para cerrar.' });
      }
  
      // Actualiza el turno activo para cerrarlo
      activeShift.fondo_final = fondo_final;
      activeShift.estado = 'cerrado'; // Cambia el estado a "cerrado"
      activeShift.activo = false; // Cambia el campo activo a false
      activeShift.cierre = new Date(); // Fecha de cierre
      await activeShift.save();
  
      res.status(200).json({ message: 'Turno cerrado exitosamente', turno: activeShift });
    } catch (error) {
      console.error('Error al cerrar turno:', error);
      res.status(500).json({ error: 'Error al cerrar turno', details: error });
    }
  };
  