const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const dbPath = path.join(__dirname, '../data/db.json');

exports.createSale = (req, res) => {
  const { sale } = req.body; // La venta incluye productos, método de pago y total
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.sales.push(sale); // Registrar la venta
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({ message: 'Venta registrada con éxito' });
};

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

exports.setInitialCash = (req, res) => {
  const { initialCash, operator } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.initialCash = {
    amount: parseFloat(initialCash),
    operator,
    date: new Date().toISOString(),
  };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json({ message: 'Fondo de caja registrado exitosamente' });
};

exports.generateInitialCashPDF = (req, res) => {
  const { initialCash, operator } = req.body;

  const doc = new PDFDocument();
  const filename = `Fondo_Inicial_${new Date().toISOString()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text('Comprobante de Fondo Inicial', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${new Date().toLocaleString()}`);
  doc.text(`Operador: ${operator}`);
  doc.text(`Monto Inicial: $${initialCash}`);
  doc.end();
};

exports.recordWithdrawal = (req, res) => {
  const { amount, operator } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.withdrawals = db.withdrawals || [];
  db.withdrawals.push({
    amount: parseFloat(amount),
    operator,
    date: new Date().toISOString(),
  });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json({ message: 'Retiro registrado exitosamente' });
};

exports.generateWithdrawalPDF = (req, res) => {
  const { amount, operator } = req.body;

  const doc = new PDFDocument();
  const filename = `Retiro_${new Date().toISOString()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text('Comprobante de Retiro', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${new Date().toLocaleString()}`);
  doc.text(`Operador: ${operator}`);
  doc.text(`Monto Retirado: $${amount}`);
  doc.end();
};

/* exports.closeShift = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const sales = db.sales || [];
  const withdrawals = db.withdrawals || [];
  const initialCash = db.initialCash || { amount: 0 };

  // Calcular totales
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  // Calcular totales por método de pago
  const paymentBreakdown = sales.reduce((acc, sale) => {
    const method = sale.paymentMethod;
    acc[method] = (acc[method] || 0) + sale.total;
    return acc;
  }, {});

  // Calcular efectivo y dinero en cuenta para el arqueo parcial
  const cashInHand = initialCash.amount + (paymentBreakdown['Efectivo'] || 0) - totalWithdrawals;
  const moneyInAccount = (paymentBreakdown['Tarjeta'] || 0) + (paymentBreakdown['Transferencia'] || 0);

  // Responder con los datos calculados
  res.json({
    totalSales,
    totalWithdrawals,
    withdrawalDetails: withdrawals.map((withdrawal, index) => ({
      id: index + 1,
      operator: withdrawal.operator,
      amount: withdrawal.amount,
      date: new Date(withdrawal.date).toLocaleString(),
    })),
    paymentBreakdown,
    initialCash: initialCash.amount,
    cashInHand,
    moneyInAccount,
    finalCash: cashInHand + moneyInAccount, // Total en caja (efectivo + cuenta)
  });

  // Reiniciar datos si es un cierre Z
  if (req.query.reset) {
    db.sales = [];
    db.withdrawals = [];
    db.initialCash = null;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
}; */
exports.closeShift = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const sales = db.sales || [];
  const withdrawals = db.withdrawals || [];
  const initialCash = db.initialCash || { amount: 0 };

  // Calcular ventas totales por método de pago
  const paymentMethodTotals = sales.reduce((totals, sale) => {
    const method = sale.paymentMethod || 'Otros';
    totals[method] = (totals[method] || 0) + sale.total;
    return totals;
  }, {});

  // Calcular totales generales
  const totalSales = Object.values(paymentMethodTotals).reduce((sum, value) => sum + value, 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  // Arqueo parcial: efectivo en caja y dinero en cuenta
  const cashMethods = ['Efectivo'];
  const accountMethods = ['Debito','Credito','App Delivery','Transferencia'];
  const cashInBox = initialCash.amount + sales.reduce((sum, sale) => {
    if (cashMethods.includes(sale.paymentMethod)) {
      return sum + sale.total;
    }
    return sum;
  }, 0) - totalWithdrawals;

  const moneyInAccount = sales.reduce((sum, sale) => {
    if (accountMethods.includes(sale.paymentMethod)) {
      return sum + sale.total;
    }
    return sum;
  }, 0);

  const finalCash = cashInBox + moneyInAccount;

  // Detallar retiros
  const withdrawalDetails = withdrawals.map((withdrawal, index) => ({
    id: index + 1,
    operator: withdrawal.operator,
    amount: withdrawal.amount,
    date: new Date(withdrawal.date).toLocaleString(),
  }));

  // Crear el registro del cierre
  const closure = {
    date: new Date().toISOString(),
    type: req.query.reset ? 'Z' : 'X',
    totalSales,
    paymentMethodTotals,
    totalWithdrawals,
    withdrawalDetails,
    initialCash: initialCash.amount,
    cashInBox,
    moneyInAccount,
    finalCash,
  };

  // Guardar el cierre en el historial
  db.closures = db.closures || [];
  db.closures.push(closure);

  // Si es un cierre Z, reiniciar fondo inicial pero conservar historial
  if (req.query.reset) {
    db.initialCash = { amount: finalCash, operator: 'Sistema', date: new Date().toISOString() };
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json(closure);
};

exports.generateCloseShiftPDF = (req, res) => {
  const {
    totalSales = 0,
    paymentMethodTotals = {}, // Asignar objeto vacío si no se recibe
    totalWithdrawals = 0,
    withdrawalDetails = [],
    initialCash = 0,
    cashInBox = 0,
    moneyInAccount = 0,
    finalCash = 0,
    type = 'X',
  } = req.body;

  const doc = new PDFDocument();
  const filename = `Cierre_${type}_${new Date().toISOString()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text(`Comprobante de Cierre ${type}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${new Date().toLocaleString()}`);
  doc.text(`Fondo Inicial: $${initialCash}`);
  doc.text(`Ventas Totales: $${totalSales}`);
  doc.moveDown();

  doc.text('Desglose por Método de Pago:', { underline: true });
  if (Object.keys(paymentMethodTotals).length === 0) {
    doc.text('No se registraron ventas.');
  } else {
    Object.entries(paymentMethodTotals).forEach(([method, total]) => {
      doc.text(`${method}: $${total}`);
    });
  }

  doc.moveDown();
  doc.text(`Retiros Totales: $${totalWithdrawals}`);
  doc.moveDown();

  doc.text('Arqueo Parcial:', { underline: true });
  doc.text(`Efectivo en Caja: $${cashInBox}`);
  doc.text(`Dinero en Cuenta: $${moneyInAccount}`);
  doc.text(`Total Final: $${finalCash}`);
  doc.moveDown();

  doc.text('Detalle de Retiros:', { underline: true });
  if (withdrawalDetails.length === 0) {
    doc.text('No se registraron retiros durante el turno.');
  } else {
    withdrawalDetails.forEach((withdrawal, index) => {
      doc.text(`${index + 1}. ${withdrawal.date} - Operador: ${withdrawal.operator} - Monto: $${withdrawal.amount}`);
    });
  }

  doc.end();
};


exports.generateDailyReportPDF = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const sales = db.sales || [];

  const doc = new PDFDocument();
  const filename = `Reporte_Diario_${new Date().toISOString()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text('Reporte Diario', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${new Date().toLocaleString()}`);
  doc.moveDown();

  if (sales.length === 0) {
    doc.text('No se han registrado ventas el día de hoy.');
  } else {
    let totalSales = 0;
    sales.forEach((sale, index) => {
      doc.text(`Venta #${index + 1}`);
      doc.text(`Fecha: ${new Date(sale.date).toLocaleString()}`);
      doc.text(`Método de Pago: ${sale.paymentMethod}`);
      doc.text(`Total: $${sale.total}`);
      doc.moveDown();
      totalSales += sale.total;
    });

    doc.text(`Total General de Ventas: $${totalSales}`, { align: 'right' });
  }

  doc.end();
};

exports.getClosures = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const closures = db.closures || [];
  res.status(200).json(closures);
};