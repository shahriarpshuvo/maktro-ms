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

const docDefinition = (data) => {
    return {
        content: [
            {
                columns: [
                    [
                        {
                            image: './public/images/logo.png',
                            width: 120,
                        },
                        {
                            text: 'Maktro Electronics Ltd.',
                            style: 'title',
                        },
                        {
                            text: `Razia Sulatana Road, \n Mohammadpur, Dhaka-1209, \nContact: 01717998833, 01331283455`,
                            style: 'generalText',
                        },
                    ],
                    [
                        {
                            text: 'INVOICE',
                            style: 'header',
                            alignment: 'right',
                        },
                        {
                            text: `Invoice ID: ${data.id.slice(-8)}`,
                            alignment: 'right',
                            style: 'lessFocused',
                        },
                        {
                            text: `Date: ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
                            alignment: 'right',
                            style: 'generalText',
                        },
                        {
                            text: '',
                            style: 'mb3',
                        },
                    ],
                ],
            },

            {
                columns: [
                    [
                        {
                            text: `${data.customer.name}`,
                            style: 'h2',
                            alignment: 'right',
                        },
                        {
                            text: `${data.customer.address}`,
                            style: 'lessFocused',
                            alignment: 'right',
                        },
                        {
                            text: `Contact: ${data.customer.phone}`,
                            style: 'generalText',
                            alignment: 'right',
                        },
                        {
                            text: '',
                            style: 'mb3',
                        },
                    ],
                ],
            },
            {
                text: '_______',
                alignment: 'center',
                style: 'table',
            },
            {
                text: `Sales Date: ${data.salesDate.toLocaleDateString()}`,
                alignment: 'center',
                style: 'lessFocused',
            },
            {
                table: {
                    widths: [200, '*', '*', '*'],
                    body: [
                        [
                            {
                                text: 'Description',
                                style: 'tableHeader',
                                alignment: 'center',
                                margin: 6,
                            },
                            {
                                text: 'Quantity(n)',
                                style: 'tableHeader',
                                alignment: 'center',
                                margin: 6,
                            },
                            {
                                text: 'Rate(Tk.)',
                                style: 'tableHeader',
                                alignment: 'center',
                                margin: 6,
                            },
                            {
                                text: 'Total(Tk.)',
                                style: 'tableHeader',
                                alignment: 'center',
                                margin: 6,
                            },
                        ],
                        [
                            {
                                text: `Product Name: \n${data.product.name}`,
                                style: 'tableText',
                                margin: 5,
                            },
                            {
                                text: `${data.quantity.toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'center',
                                margin: 5,
                            },
                            {
                                text: `${data.rate.toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'center',
                                margin: 5,
                            },
                            {
                                text: `${(
                                    data.rate * data.quantity
                                ).toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            {
                                text: 'Shipping Cost',
                                style: 'tableText',
                                margin: 5,
                            },
                            { text: '' },
                            { text: '' },
                            {
                                text: `${data.shippingCost.toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            { text: 'Discount', style: 'tableText', margin: 5 },
                            { text: '' },
                            { text: '' },
                            {
                                text: `- ${data.discount.toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            { text: 'Paid', style: 'tableText', margin: 5 },
                            { text: '' },
                            { text: '' },
                            {
                                text: `${data.paid.toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            {
                                text: 'Net Bill',
                                style: 'tableText',
                                margin: 5,
                                colSpan: 3,
                            },
                            { text: '' },
                            { text: '' },
                            {
                                text: `${(
                                    data.rate * data.quantity -
                                    data.discount +
                                    data.shippingCost
                                ).toLocaleString()}`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            {
                                text: 'Current Due',
                                style: 'tableText',
                                margin: 5,
                                colSpan: 3,
                            },
                            { text: '' },
                            { text: '' },
                            {
                                text: `(${(
                                    data.rate * data.quantity -
                                    data.discount +
                                    data.shippingCost -
                                    data.paid
                                ).toLocaleString()})`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            {
                                text: 'Previous Due',
                                style: 'tableText',
                                margin: 5,
                                colSpan: 3,
                            },
                            { text: '' },
                            { text: '' },
                            {
                                text: `(${(
                                    data.customer.due -
                                    (data.rate * data.quantity -
                                        data.discount +
                                        data.shippingCost -
                                        data.paid)
                                ).toLocaleString()})`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                        [
                            {
                                text: 'Total Due',
                                style: 'tableText',
                                margin: 5,
                                colSpan: 3,
                            },
                            { text: '' },
                            { text: '' },
                            {
                                text: `(${data.customer.due.toLocaleString()})`,
                                style: 'tableText',
                                alignment: 'right',
                                margin: 5,
                            },
                        ],
                    ],
                },
            },
            {
                text: '',
                style: 'mt30',
            },
            {
                text: 'Comments',
                style: 'lessFocused',
            },
            {
                text: `${data.comment}`,
                style: 'generalText',
            },
            {
                text: '...',
                alignment: 'center',
                style: 'mb30',
            },
            {
                columns: [
                    {
                        text: `Authorized By\n\n\n___________________________\nMaktro Electronics Ltd.`,
                        style: 'generalText',
                    },
                    {
                        text: `Customer Sign\n\n\n___________________________\n${data.customer.name}`,
                        style: 'generalText',
                        alignment: 'right',
                    },
                ],
            },
        ],
        styles: {
            header: {
                fontSize: 28,
                bold: true,
                color: '#6a60a9',
            },
            lessFocused: {
                fontSize: 11,
                color: '#888',
                lineHeight: 1.4,
            },
            generalText: {
                fontSize: 10,
                color: '#444',
                lineHeight: 1.2,
            },
            title: {
                fontSize: 15,
                bold: 'true',
                color: '#6a60a9',
                lineHeight: 1.4,
            },
            h2: {
                fontSize: 13,
                bold: 'true',
                color: '#555',
                lineHeight: 1.3,
            },
            mb30: {
                marginBottom: 30,
            },
            mt30: {
                marginTop: 30,
            },
            table: {
                marginTop: 30,
                marginBottom: 30,
            },
            tableHeader: {
                fontSize: 13,
                bold: 'true',
                color: '#6a60a9',
            },
            tableText: {
                fontSize: 12,
                color: '#333',
            },
        },
    };
};

const GenerateInvoice = async (req, res, next) => {
    const sale = await Sale.findById(req.params.id)
        .populate('product')
        .populate('customer');
    var pdfDoc = await printer.createPdfKitDocument(docDefinition(sale));
    if (fs.existsSync(`files/invoice/${req.params.id}.pdf`)) {
        fs.unlinkSync(`files/invoice/${req.params.id}.pdf`);
    }
    pdfDoc.pipe(fs.createWriteStream(`files/invoice/${req.params.id}.pdf`));
    pdfDoc.end();
    return next();
};

module.exports = GenerateInvoice;
