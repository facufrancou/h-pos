const Command = require('../models/Command');
const Sale = require('../models/Sale');

exports.getCommands = async (req, res) => {
  try {
    const commands = await Command.findAll({
      include: {
        model: Sale,
        as: 'venta',
      },
    });
    res.json(commands);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener comandas',
      details: error,
    });
  }
};

// Actualizar el estado de una comanda
exports.updateCommand = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const command = await Command.findByPk(id);

    if (!command) {
      return res.status(404).json({ error: 'Comanda no encontrada' });
    }

    command.estado = estado;
    await command.save();

    res.json(command);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar comanda', details: error });
  }
};
