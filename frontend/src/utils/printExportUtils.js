// Utilidad para imprimir o exportar PDF cualquier resumen de la app
// Requiere jsPDF para exportar PDF (instalar con: npm install jspdf)

export function printHtmlContent(htmlContent, title = 'Resumen') {
  const printWindow = window.open('', '', 'height=600,width=400');
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 14px; }
          .ticket { max-width: 350px; margin: auto; }
        </style>
      </head>
      <body>
        <div class="ticket">${htmlContent}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function exportHtmlToPDF(htmlContent, title = 'Resumen') {
  // jsPDF debe estar instalado y disponible
  import('jspdf').then(jsPDFModule => {
    const { jsPDF } = jsPDFModule;
    const doc = new jsPDF();
    doc.html(htmlContent, {
      callback: function (doc) {
        doc.save(`${title}.pdf`);
      },
      x: 10,
      y: 10,
      width: 180
    });
  });
}

// Utilidad para mostrar aviso en modal desde utilidades
export function showAviso(mensaje, type = "info") {
  // Crea y dispara un evento global para mostrar el aviso
  const event = new CustomEvent("modalAviso", { detail: { mensaje, type } });
  window.dispatchEvent(event);
  
  // Also trigger a toast for non-critical messages
  if (type !== "error" && type !== "danger") {
    import("./toastUtils").then(module => {
      module.showToast(mensaje, type);
    });
  }
}
