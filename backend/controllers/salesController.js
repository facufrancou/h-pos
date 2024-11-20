const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/db.json');

exports.createSale = (req, res) => {
  const { sale } = req.body; // La venta incluye productos, método de pago y total
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.sales.push(sale); // Registrar la venta
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({ message: 'Venta registrada con éxito' });
};

/* exports.getSalesByDateRange = (req, res) => {
  const { startDate, endDate } = req.query;
  const db = JSON.parse(fs.readFileSync(dbPath));

  const filteredSales = db.sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
  });

  res.json(filteredSales);
}; */
exports.getSalesByDateRange = (req, res) => {
  const { startDate, endDate } = req.query;

  // Convertir las fechas del filtro al inicio del día
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Fin del día para incluir todas las ventas de esa fecha

  const db = JSON.parse(fs.readFileSync(dbPath));

  // Filtrar las ventas por rango de fechas
  const filteredSales = db.sales.filter((sale) => {
    const saleDate = new Date(sale.date); // Convertir fecha de la venta
    return saleDate >= start && saleDate <= end; // Comparar rango
  });

  res.json(filteredSales);
};