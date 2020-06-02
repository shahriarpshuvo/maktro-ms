const PdfPrinter = require('pdfmake');
const Sale = require('../models/Sale');
const fs = require('fs');

const fonts = {
    Roboto: {
        normal: 'public/fonts/Roboto-Regular.ttf',
        bold: 'public/fonts/Roboto-Medium.ttf',
        italics: 'public/fonts/Roboto-Italic.ttf',
        bolditalics: 'public/fonts/Roboto-Italic.ttf',
    },
};

const printer = new PdfPrinter(fonts);

const docDefinition = (data) =>{
    return {
        content: [
            {
                text: `New: ${data}`,
                style: 'header',
                alignment: 'center',
            },
        ],
    };
};

const GenerateInvoice = async (req, res, next) => {
    const sale = await Sale.findById(req.params.id).populate('product');
    var pdfDoc = printer.createPdfKitDocument(docDefinition(sale));
    pdfDoc.pipe(fs.createWriteStream(`${req.params.id}.pdf`));
    pdfDoc.end();
    next();
};

module.exports = GenerateInvoice;
