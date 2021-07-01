const PdfPrinter = require('pdfmake');
const Servicing = require('../models/Servicing');
const dateFormat = require('dateformat');
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
              text: `2/23 Razia Sultana Road,\n Mohammadpur, Dhaka.\nwww.maktro.com\n01714-178875, 01714-178876`,
              style: 'generalText',
            },
          ],
          [
            {
              text: 'SERVICING',
              style: 'header',
              alignment: 'right',
            },
            {
              text: `Service ID: ${data.id.slice(-8)}`,
              alignment: 'right',
              style: 'lessFocused',
            },
            {
              text: `Status: ${data.status.toUpperCase()}`,
              alignment: 'right',
              bold: true,
              style: 'primaryText',
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
              text: `${data.name}`,
              style: 'h2',
              alignment: 'right',
            },
            {
              text: `${data.address}`,
              style: 'lessFocused',
              alignment: 'right',
            },
            {
              text: `Contact: ${data.phone}`,
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
        text: `Received Date: ${dateFormat(data.createdAt, 'mmmm d, yyyy')}`,
        alignment: 'center',
        style: 'lessFocused',
      },
      {
        table: {
          widths: [300, '*'],
          body: [
            [
              {
                text: 'Description',
                style: 'tableHeader',
                alignment: 'center',
                margin: 6,
              },
              {
                text: 'Amount',
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
                text: `${data.quantity.toLocaleString()} Unit(s)`,
                style: 'tableText',
                alignment: 'center',
                margin: 5,
              },
            ],
            [
              {
                text: `Servicing Charge`,
                style: 'tableText',
                margin: 5,
              },
              {
                text: `${
                  data.serviceCharge
                    ? data.serviceCharge.toLocaleString() + ' Tk/-'
                    : '-'
                }`,
                style: 'tableText',
                alignment: 'center',
                margin: 5,
              },
            ],

            [
              {
                text: `Expected Delivery Date:\n${dateFormat(
                  data.deliverDate,
                  'mmmm d, yyyy'
                )}`,
                style: 'tableText',
                margin: 5,
                colSpan: 2,
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
            text: `Customer Sign\n\n\n___________________________\n${data.name}`,
            style: 'generalText',
            alignment: 'right',
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 26,
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
      primaryText: {
        fontSize: 10,
        color: '#6a60a9',
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

const GeneratePdf = async (req, res, next) => {
  const servicing = await Servicing.findById(req.params.id).populate('product');
  const pdfDoc = await printer.createPdfKitDocument(docDefinition(servicing));
  if (fs.existsSync(`files/servicing/${req.params.id}.pdf`)) {
    fs.unlinkSync(`files/servicing/${req.params.id}.pdf`);
  }
  pdfDoc.pipe(fs.createWriteStream(`files/servicing/${req.params.id}.pdf`));
  pdfDoc.end();
  return next();
};

module.exports = GeneratePdf;
