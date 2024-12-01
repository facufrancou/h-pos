const Shift = require('../models/Shift');
const Sale = require('../models/Sale');
const Withdrawal = require('../models/Withdrawal');
const Fund = require('../models/Fund');

exports.startShift = async (req, res) => {
    try {
        const { usuario, fondo_inicial } = req.body;

        const activeShift = await Shift.findOne({ where: { estado: 'abierto' } });
        if (activeShift) {
            return res.status(400).json({ error: 'Ya existe un turno abierto' });
        }

        const newShift = await Shift.create({
            usuario,
            fondo_inicial,
            inicio: new Date(),
        });

        res.status(201).json(newShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar turno' });
    }
};

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

exports.closeShift = async (req, res) => {
    try {
        const { fondo_final } = req.body;

        const activeShift = await Shift.findOne({ where: { estado: 'abierto' } });
        if (!activeShift) {
            return res.status(404).json({ error: 'No hay un turno activo para cerrar' });
        }

        const ventasEfectivo = await Sale.sum('total', { where: { turno_id: activeShift.id, metodo_pago_id: 1 } });
        const totalRetiros = await Withdrawal.sum('monto', { where: { turno_id: activeShift.id } });
        const totalFondos = await Fund.sum('monto', { where: { turno_id: activeShift.id } });

        const calculatedFondoFinal = activeShift.fondo_inicial + totalFondos + ventasEfectivo - totalRetiros;

        activeShift.fondo_final = fondo_final || calculatedFondoFinal;
        activeShift.cierre = new Date();
        activeShift.estado = 'cerrado';

        await activeShift.save();

        res.json(activeShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cerrar turno' });
    }
};
