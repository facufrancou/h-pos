const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const dbPath = path.join(__dirname, "../data/db.json");
const historyPath = path.join(__dirname, "../data/historical.json");

const filterByDateRange = (data, startDate, endDate) => {
  const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
  const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

  return data.filter((item) => {
    const itemDate = new Date(item.date).getTime();
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });
};
const getLocalISOString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
  const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
  return localTime.toISOString(); // Retornar en formato ISO ajustado
};
// Función para cargar la base de datos activa
const loadDatabase = () => JSON.parse(fs.readFileSync(dbPath));

// Función para guardar la base de datos activa
const saveDatabase = (db) =>
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Función para cargar la base de datos histórica
const loadHistoricalDatabase = () => JSON.parse(fs.readFileSync(historyPath));

// Función para guardar la base de datos histórica
const saveHistoricalDatabase = (history) =>
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

exports.createSale = (req, res) => {
  const { sale } = req.body;
  const db = loadDatabase();

  // Asociar la venta con el turno actual
  const currentShift = db.currentShift || 1;
  sale.shift = currentShift; // Asignar turno a la venta
  db.sales.push(sale);

  saveDatabase(db);
  res.status(201).json({ message: "Venta registrada con éxito" });
};
exports.closeShift = (req, res) => {
  const db = loadDatabase();
  const history = loadHistoricalDatabase();

  const sales = db.sales || [];
  const withdrawals = db.withdrawals || [];
  const initialCash = db.initialCash || { amount: 0 };
  const currentShift = db.currentShift || 1;

  // Filtrar las ventas correspondientes al turno actual
  const shiftSales = sales.filter((sale) => sale.shift === currentShift);
  const totalSales = shiftSales.reduce((sum, sale) => sum + sale.total, 0);

  // Calcular totales
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  // Calcular efectivo y dinero en cuenta
  const cashMethods = ["Efectivo"];
  const accountMethods = ["Debito", "Credito", "App Delivery", "Transferencia"];

  const cashInBox =
    initialCash.amount +
    shiftSales.reduce((sum, sale) => {
      if (cashMethods.includes(sale.paymentMethod)) {
        return sum + sale.total;
      }
      return sum;
    }, 0) -
    totalWithdrawals;

  const moneyInAccount = shiftSales.reduce((sum, sale) => {
    if (accountMethods.includes(sale.paymentMethod)) {
      return sum + sale.total;
    }
    return sum;
  }, 0);

  const finalCash = cashInBox + moneyInAccount;

  // Función para obtener la fecha ajustada a la zona horaria local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().slice(0, -1); // Quitar la 'Z' del final
  };

  // Crear registro del cierre
  const closure = {
    shift: currentShift,
    date: getLocalISOString(), // Fecha ajustada a la hora local
    type: req.query.reset ? "Z" : "X",
    totalSales,
    salesDetails: shiftSales,
    totalWithdrawals,
    withdrawalDetails: withdrawals.map((withdrawal) => ({
      operator: withdrawal.operator,
      amount: withdrawal.amount,
      date: withdrawal.date,
    })),
    initialCash: initialCash.amount,
    cashInBox,
    moneyInAccount,
    finalCash,
  };

  // Guardar el cierre en el historial
  history.closures = history.closures || [];
  history.closures.push(closure);

  // Mover ventas y retiros al historial
  history.sales = [...(history.sales || []), ...shiftSales];
  history.withdrawals = [...(history.withdrawals || []), ...withdrawals];

  // Si es un cierre Z, limpiar datos
  if (req.query.reset) {
    db.sales = [];
    db.withdrawals = [];
    db.initialCash = null;
  } else {
    // Si es cierre X, actualizar el fondo inicial
    db.sales = db.sales.filter((sale) => sale.shift !== currentShift);
    db.initialCash = {
      amount: cashInBox,
      operator: "Sistema",
      date: getLocalISOString(),
    }; // Ajustar la fecha a la zona horaria local
  }

  // Incrementar el turno actual
  db.currentShift = currentShift + 1;

  saveDatabase(db);
  saveHistoricalDatabase(history);
  res.status(200).json(closure);
};
exports.getHistoricalSales = (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione las fechas de inicio y fin" });
  }

  // Función para ajustar cualquier fecha a la hora local
  const adjustToLocalTime = (dateString) => {
    const date = new Date(dateString); // Crear fecha desde el string
    const localOffset = date.getTimezoneOffset() * 60000; // Obtener desfase en milisegundos
    return new Date(date.getTime() - localOffset); // Restar desfase para ajustar a hora local
  };

  // Ajustar las fechas al inicio y fin del día en hora local
  const start = adjustToLocalTime(`${startDate}T00:00:00`); // Inicio del día
  const end = adjustToLocalTime(`${endDate}T23:59:59`); // Fin del día

  const history = loadHistoricalDatabase();

  // Filtrar las ventas por rango de fechas ajustado a la hora local
  const filteredSales = (history.sales || []).filter((sale) => {
    const saleLocalDate = adjustToLocalTime(sale.date); // Ajustar fecha de la venta a la hora local
    return saleLocalDate >= start && saleLocalDate <= end; // Comparar con rango local
  });

  res.status(200).json(filteredSales);
};
exports.getHistoricalWithdrawals = (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione las fechas de inicio y fin" });
  }

  // Función para ajustar cualquier fecha a la hora local
  const adjustToLocalTime = (dateString) => {
    const date = new Date(dateString);
    const localOffset = date.getTimezoneOffset() * 60000; // Obtener desfase en milisegundos
    return new Date(date.getTime() - localOffset); // Ajustar fecha
  };

  // Ajustar las fechas al inicio y fin del día en hora local
  const start = adjustToLocalTime(`${startDate}T00:00:00`); // Inicio del día
  const end = adjustToLocalTime(`${endDate}T23:59:59`); // Fin del día

  const history = loadHistoricalDatabase();

  // Filtrar los retiros por rango de fechas ajustado a la hora local
  const filteredWithdrawals = (history.withdrawals || []).filter(
    (withdrawal) => {
      const withdrawalLocalDate = adjustToLocalTime(withdrawal.date); // Ajustar fecha del retiro
      return withdrawalLocalDate >= start && withdrawalLocalDate <= end; // Comparar con rango local
    }
  );

  res.status(200).json(filteredWithdrawals);
};
exports.getHistoricalClosures = (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione las fechas de inicio y fin" });
  }

  // Función para ajustar cualquier fecha a la hora local
  const adjustToLocalTime = (dateString) => {
    const date = new Date(dateString);
    const localOffset = date.getTimezoneOffset() * 60000; // Obtener desfase en milisegundos
    return new Date(date.getTime() - localOffset); // Ajustar fecha
  };

  // Ajustar las fechas al inicio y fin del día en hora local
  const start = adjustToLocalTime(`${startDate}T00:00:00`); // Inicio del día
  const end = adjustToLocalTime(`${endDate}T23:59:59`); // Fin del día

  const history = loadHistoricalDatabase();

  // Filtrar los cierres por rango de fechas ajustado a la hora local
  const filteredClosures = (history.closures || []).filter((closure) => {
    const closureLocalDate = adjustToLocalTime(closure.date); // Ajustar fecha del cierre
    return closureLocalDate >= start && closureLocalDate <= end; // Comparar con rango local
  });

  res.status(200).json(filteredClosures);
};
exports.getSalesByDateRange = (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate);

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Por favor, proporcione las fechas de inicio y fin" });
  }

  // Convertir las fechas de inicio y fin al inicio y fin del día
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const db = JSON.parse(fs.readFileSync(dbPath));

  // Filtrar las ventas por rango de fechas
  const filteredSales = db.sales.filter((sale) => {
    // Ajustar la fecha de la venta a la hora local
    const saleDate = new Date(sale.date);
    const saleLocalDate = new Date(
      saleDate.getTime() - saleDate.getTimezoneOffset() * 60000
    );

    // Comparar fechas
    return saleLocalDate >= start && saleLocalDate <= end;
  });

  res.json(filteredSales);
};
exports.setInitialCash = (req, res) => {
  const { initialCash, operator } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));

  // Función para obtener la fecha ajustada a la hora local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().slice(0, -1); // Quitar la 'Z' del final
  };

  // Guardar el fondo inicial en la base de datos
  db.initialCash = {
    amount: parseFloat(initialCash),
    operator,
    date: getLocalISOString(), // Fecha ajustada a la hora local
  };

  // Guardar los cambios en el archivo
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  // Responder al cliente
  res.status(200).json({ message: "Fondo de caja registrado exitosamente" });
};
exports.generateInitialCashPDF = (req, res) => {
  const { initialCash, operator } = req.body;

  // Función para obtener la fecha ajustada a la hora local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().replace(/[:.]/g, "-"); // Ajustar formato para nombre del archivo
  };

  // Función para obtener una fecha legible para el contenido del PDF
  const getLocalReadableDate = () => {
    return new Date().toLocaleString(); // Fecha legible en hora local
  };

  const doc = new PDFDocument();
  const filename = `Fondo_Inicial_${getLocalISOString()}.pdf`; // Fecha ajustada en el nombre del archivo

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text("Comprobante de Fondo Inicial", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${getLocalReadableDate()}`); // Fecha legible en hora local
  doc.text(`Operador: ${operator}`);
  doc.text(`Monto Inicial: $${initialCash}`);
  doc.end();
};
exports.recordWithdrawal = (req, res) => {
  const { amount, operator } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath));

  // Inicializar el array de retiros si no existe
  db.withdrawals = db.withdrawals || [];

  // Función para obtener la fecha en formato ISO ajustada a la hora local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().slice(0, -1); // Quitar la 'Z' al final
  };

  // Agregar el retiro a la base de datos
  db.withdrawals.push({
    amount: parseFloat(amount),
    operator,
    date: getLocalISOString(), // Guardar la fecha ajustada a la hora local
  });

  // Guardar los datos actualizados en el archivo
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  // Enviar la respuesta al cliente
  res.status(200).json({ message: "Retiro registrado exitosamente" });
};
exports.generateWithdrawalPDF = (req, res) => {
  const { amount, operator } = req.body;

  // Función para obtener la fecha ajustada a la hora local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().replace(/[:.]/g, "-"); // Ajustar formato para nombre del archivo
  };

  // Función para obtener una fecha legible para el contenido del PDF
  const getLocalReadableDate = () => {
    return new Date().toLocaleString(); // Fecha legible en hora local
  };

  const doc = new PDFDocument();
  const filename = `Retiro_${getLocalISOString()}.pdf`; // Fecha ajustada en el nombre del archivo

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text("Comprobante de Retiro", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${getLocalReadableDate()}`); // Fecha legible en hora local
  doc.text(`Operador: ${operator}`);
  doc.text(`Monto Retirado: $${amount}`);
  doc.end();
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
    type = "X",
  } = req.body;

  // Función para obtener la fecha ajustada a la hora local
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().replace(/[:.]/g, "-"); // Ajustar formato para nombre del archivo
  };

  // Función para obtener una fecha legible para el contenido del PDF
  const getLocalReadableDate = () => {
    return new Date().toLocaleString(); // Fecha legible en hora local
  };

  const doc = new PDFDocument();
  const filename = `Cierre_${type}_${getLocalISOString()}.pdf`; // Fecha ajustada en el nombre del archivo

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text(`Comprobante de Cierre ${type}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha: ${getLocalReadableDate()}`); // Fecha legible en hora local
  doc.text(`Fondo Inicial: $${initialCash}`);
  doc.text(`Ventas Totales: $${totalSales}`);
  doc.moveDown();

  doc.text("Desglose por Método de Pago:", { underline: true });
  if (Object.keys(paymentMethodTotals).length === 0) {
    doc.text("No se registraron ventas.");
  } else {
    Object.entries(paymentMethodTotals).forEach(([method, total]) => {
      doc.text(`${method}: $${total}`);
    });
  }

  doc.moveDown();
  doc.text(`Retiros Totales: $${totalWithdrawals}`);
  doc.moveDown();

  doc.text("Arqueo Parcial:", { underline: true });
  doc.text(`Efectivo en Caja: $${cashInBox}`);
  doc.text(`Dinero en Cuenta: $${moneyInAccount}`);
  doc.text(`Total Final: $${finalCash}`);
  doc.moveDown();

  doc.text("Detalle de Retiros:", { underline: true });
  if (withdrawalDetails.length === 0) {
    doc.text("No se registraron retiros durante el turno.");
  } else {
    withdrawalDetails.forEach((withdrawal, index) => {
      doc.text(
        `${index + 1}. ${new Date(
          withdrawal.date
        ).toLocaleString()} - Operador: ${withdrawal.operator} - Monto: $${
          withdrawal.amount
        }`
      ); // Fecha legible en hora local
    });
  }

  doc.end();
};
exports.generateDailyReportPDF = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const history = JSON.parse(fs.readFileSync(historyPath));
  const sales = [...(db.sales || []), ...(history.sales || [])]; // Fusionar ventas de db y history
  const withdrawals = db.withdrawals || [];
  const closures = db.closures || [];

  
 

  // Función para obtener la fecha local en formato ISO (sin desfase UTC)
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convertir desfase de minutos a milisegundos
    const localTime = new Date(now.getTime() - offset); // Ajustar el tiempo local
    return localTime.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  // Función para obtener una fecha legible para el contenido del PDF
  const getLocalReadableDate = () => {
    return new Date().toLocaleString(); // Fecha legible en hora local
  };

  // Fecha local del día actual
  const today = getLocalISOString(); // Fecha en formato YYYY-MM-DD
  const dailySales = sales.filter((sale) => sale.date.startsWith(today));
  const dailyClosures = history.closures.filter((closure) =>
    closure.date.startsWith(today)
  );
  const dailyWithdrawals = withdrawals.filter((withdrawal) =>
    withdrawal.date.startsWith(today)
  );
  
  // Verificar si hay un cierre Z en el día
  const zClosures = history.closures.filter(
    (closure) => closure.date.startsWith(today) && closure.type === "Z"
  );


  
  // Calcular totales
  const totalSalesAmount = dailySales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );
  const totalSalesCount = dailySales.length;

  const paymentMethodTotals = dailySales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {});

  const totalWithdrawalsAmount = dailyWithdrawals.reduce(
    (sum, w) => sum + w.amount,
    0
  );

  // Crear el documento PDF
  const doc = new PDFDocument();
  const filename = `Reporte_Diario_${today}.pdf`;

 /*  if (zClosures.length > 0) {
    const lastZClosure = zClosures[zClosures.length - 1];
    doc.fontSize(14).text('Reporte Diario Cerrado', { align: 'center' });
    doc.fontSize(12).text(
        `Se realizó un cierre Z el ${new Date(lastZClosure.date).toLocaleString()}. No hay más información disponible para el día.`,
        { align: 'center' }
    );
    doc.end();
    return; // Detener la generación del reporte
} */

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Encabezado
  doc.fontSize(18).text("Reporte Diario", { align: "center" });
  doc
    .fontSize(12)
    .text(`Fecha: ${getLocalReadableDate()}`, { align: "center" }); // Fecha legible
  doc.moveDown();

  // Totales generales
  doc.fontSize(14).text("Totales Generales:");
  doc.fontSize(12).text(`Total de Ventas: ${totalSalesCount} ventas`);
  doc.fontSize(12).text(`Monto Total de Ventas: $${totalSalesAmount}`);
  doc.moveDown();

  // Desglose por método de pago
  doc.fontSize(14).text("Desglose por Método de Pago:");
  Object.entries(paymentMethodTotals).forEach(([method, total]) => {
    doc.fontSize(12).text(`${method}: $${total}`);
  });
  doc.moveDown();

  // Total de retiros
  doc.fontSize(14).text("Retiros Totales:");
  doc.fontSize(12).text(`Monto Total de Retiros: $${totalWithdrawalsAmount}`);
  doc.moveDown();

  // Detalle de Retiros
  doc.fontSize(14).text("Detalle de Retiros:");
  if (dailyWithdrawals.length === 0) {
    doc.fontSize(12).text("No se registraron retiros.");
  } else {
    dailyWithdrawals.forEach((withdrawal, idx) => {
      doc
        .fontSize(12)
        .text(
          `${idx + 1}. Fecha: ${withdrawal.date} - Operador: ${
            withdrawal.operator
          } - Monto: $${withdrawal.amount}`
        );
    });
  }
  doc.moveDown();

  doc.fontSize(14).text("Balance por Cierre de Turno:");
  if (dailyClosures.length === 0) {
    doc.fontSize(12).text("No se registraron cierres de turno.");
  } else {
    dailyClosures.forEach((closure, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. Cierre N°${
            closure.closureNumber || index + 1
          } - Tipo: ${closure.type} - Fecha: ${new Date(
            closure.date
          ).toLocaleString()}`
        );
      doc.fontSize(12).text(`  - Ventas Totales: $${closure.totalSales || 0}`);
      doc
        .fontSize(12)
        .text(`  - Retiros Totales: $${closure.totalWithdrawals || 0}`);
      doc
        .fontSize(12)
        .text(`  - Balance Final en Caja: $${closure.finalCash || 0}`);
      doc.moveDown();
    });
  }

  // Lista de ventas con detalle
  doc.fontSize(14).text("Detalle de Ventas:");
  if (dailySales.length === 0) {
    doc.fontSize(12).text("No se registraron ventas.");
  } else {
    dailySales.forEach((sale, idx) => {
      doc
        .fontSize(12)
        .text(
          `${idx + 1}. Fecha: ${sale.date} - Total: $${
            sale.total
          } - Método de Pago: ${sale.paymentMethod}`
        );
      sale.products.forEach((product) => {
        doc
          .fontSize(12)
          .text(
            `   - ${product.quantity}x ${product.name} ($${product.total})`
          );
      });
      doc.moveDown();
    });
  }

  doc.end();
};

exports.getClosures = (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  const closures = db.closures || [];
  res.status(200).json(closures);
};
