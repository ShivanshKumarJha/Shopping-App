const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const generateInvoice = (order, invoicePath, res) => {
  const pdfDoc = new PDFDocument({ size: 'A4', margin: 50 });

  // Set the response headers to indicate a PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="invoice-${order._id}.pdf"`,
  );

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  // Shopify logo
  const shopifyLogoPath = path.join(
    __dirname,
    '../public/img/Shopify-logo.png',
  );
  if (fs.existsSync(shopifyLogoPath)) {
    pdfDoc.image(shopifyLogoPath, 30, 30, { width: 100 });
  }

  // Company Information
  pdfDoc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Shopify', 420, 60, { align: 'right' });
  pdfDoc
    .font('Helvetica')
    .fontSize(12)
    .text('Faridabad', 420, 80, { align: 'right' });
  pdfDoc.font('Helvetica').text('Haryana, India', 420, 95, { align: 'right' });
  pdfDoc.moveDown();

  // Set the initial yPosition for the upper content
  let yPosition = 150;

  // Billing and Shipping Information
  pdfDoc.font('Helvetica-Bold').fontSize(10).text('BILL TO:', 50, yPosition);
  pdfDoc.font('Helvetica').fontSize(10);
  pdfDoc.text(order.user.name || 'Customer Name', 50, yPosition + 15);
  pdfDoc.text('Customer Address', 50, yPosition + 30);
  pdfDoc.text('Customer City', 50, yPosition + 45);

  pdfDoc.font('Helvetica-Bold').fontSize(10).text('SHIP TO:', 250, yPosition);
  pdfDoc.font('Helvetica').fontSize(10);
  pdfDoc.text(order.user.name || 'Customer Name', 250, yPosition + 15);
  pdfDoc.text('Customer Address', 250, yPosition + 30);
  pdfDoc.text('Customer City', 250, yPosition + 45);

  // Invoice Details
  pdfDoc.font('Helvetica-Bold').fontSize(10).text(`INVOICE #:`, 460, yPosition);
  pdfDoc
    .font('Helvetica')
    .fontSize(10)
    .text(`${order._id.toString().slice(-8)}`, 460, yPosition + 15);
  pdfDoc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`ORDER DATE:`, 460, yPosition + 35);
  pdfDoc
    .font('Helvetica')
    .text(`${new Date().toLocaleDateString()}`, 460, yPosition + 50);

  // Increase yPosition for the next section
  yPosition += 100;

  // Table headers
  pdfDoc.moveDown().moveDown();
  pdfDoc.font('Helvetica-Bold').fontSize(12);
  pdfDoc.text('QTY', 50, yPosition);
  pdfDoc.text('DESCRIPTION', 150, yPosition);
  pdfDoc.text('UNIT PRICE', 350, yPosition);
  pdfDoc.text('AMOUNT', 490, yPosition, { align: 'right' });

  // Add products
  pdfDoc.font('Helvetica').fontSize(10);
  yPosition += 20;
  order.products.forEach(prod => {
    pdfDoc.text(prod.quantity, 50, yPosition);
    pdfDoc.text(prod.product.title, 150, yPosition);
    pdfDoc.text(`Rs. ${prod.product.price.toFixed(2)}`, 350, yPosition);
    pdfDoc.text(
      `Rs. ${(prod.product.price * prod.quantity).toFixed(2)}`,
      450,
      yPosition,
      { align: 'right' },
    );
    yPosition += 20;
  });

  // Subtotal
  yPosition += 20;
  pdfDoc.font('Helvetica-Bold').fontSize(10).text('Subtotal:', 350, yPosition);
  pdfDoc.text(`Rs. ${order.totalPrice.toFixed(2)}`, 450, yPosition, {
    align: 'right',
  });
  yPosition += 20;

  // Invoice Total
  yPosition += 80;
  pdfDoc
    .font('Helvetica-Bold')
    .fontSize(20)
    .text(
      `Invoice Total: Rs. ${Number(order.totalPrice.toFixed(2))}`,
      50,
      yPosition,
      {
        width: 500,
        align: 'center',
      },
    );

  // Draw upper border
  pdfDoc
    .moveTo(50, yPosition - 10)
    .lineTo(550, yPosition - 10)
    .stroke();

  // Draw lower border
  pdfDoc
    .moveTo(50, yPosition + 30)
    .lineTo(550, yPosition + 30)
    .stroke();

  // Signature
  yPosition += 100;
  pdfDoc
    .font('Helvetica')
    .fontSize(12)
    .text('Shivansh Kumar Jha', 420, yPosition, { align: 'right' });

  // Terms & Conditions
  yPosition += 150;
  pdfDoc.moveDown();
  pdfDoc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('TERMS & CONDITIONS', 50, yPosition, { underline: true });
  pdfDoc.font('Helvetica').fontSize(10);
  pdfDoc.text('Payment is due within 15 days', 50, yPosition + 15);

  pdfDoc.end();
};

module.exports = generateInvoice;
