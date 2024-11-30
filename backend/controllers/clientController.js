const Client = require('../models/Client');

// Obtener todos los clientes
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', details: error });
  }
};

// Agregar un nuevo cliente
exports.addClient = async (req, res) => {
  try {
    const { nombre, apellido, direccion, email, telefono, puntos_acumulados } = req.body;

    const newClient = await Client.create({
      nombre,
      apellido,
      direccion,
      email,
      telefono,
      puntos_acumulados,
    });

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar cliente', details: error });
  }
};

// Actualizar un cliente existente
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion, email, telefono, puntos_acumulados } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    client.nombre = nombre || client.nombre;
    client.apellido = apellido || client.apellido;
    client.direccion = direccion || client.direccion;
    client.email = email || client.email;
    client.telefono = telefono || client.telefono;
    client.puntos_acumulados = puntos_acumulados || client.puntos_acumulados;

    await client.save();

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', details: error });
  }
};

// Eliminar un cliente
exports.deleteClient = async (req, res) => {
  try {
    console.log('ID recibido para eliminar:', req.params.id);
    const deleted = await Client.destroy({ where: { id: req.params.id } });
    console.log('Resultado de eliminación:', deleted);
    if (deleted) {
      return res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return res.status(500).json({ error: 'Error al eliminar cliente', details: error });
  }
};