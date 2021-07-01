const PdfPrinter = require('pdfmake');
const Sale = require('../models/Sale');
const fs = require('fs');
const dateFormat = require('dateformat');

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
  let tableBodyData = [];
  if (data.product) {
    tableBodyData.push([
      {
        text: 'Description',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Quantity (n)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Rate (Tk.)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
      {
        text: 'Amount (Tk.)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
    ]);
    tableBodyData.push([
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
        text: `${(data.rate * data.quantity).toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  } else {
    tableBodyData.push([
      {
        text: 'Description',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
        colSpan: 3,
      },
      { text: '' },
      { text: '' },
      {
        text: 'Amount (Tk.)',
        style: 'tableHeader',
        alignment: 'center',
        margin: 6,
      },
    ]);
  }

  if (data.shippingCost) {
    tableBodyData.push([
      {
        text: 'Shipping Cost',
        style: 'tableText',
        margin: 5,
        colSpan: 3,
      },
      { text: '' },
      { text: '' },
      {
        text: `${data.shippingCost.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (data.discount) {
    tableBodyData.push([
      {
        text: 'Discount',
        style: 'tableText',
        margin: 5,
        colSpan: 3,
      },
      { text: '' },
      { text: '' },
      {
        text: `- ${data.discount.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (data.rate * data.quantity) {
    tableBodyData.push([
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
    ]);
  }

  if (data.paid) {
    tableBodyData.push([
      {
        text: 'Paid',
        style: 'tableText',
        margin: 5,
        colSpan: 3,
      },
      { text: '' },
      { text: '' },
      {
        text: `${data.paid.toLocaleString()}`,
        style: 'tableText',
        alignment: 'right',
        margin: 5,
      },
    ]);
  }

  if (
    data.rate * data.quantity - data.discount + data.shippingCost - data.paid >
    0
  ) {
    tableBodyData.push([
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
    ]);
  }

  if (data.customer.due) {
    tableBodyData.push([
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
    ]);
  }

  if (data.customer.due) {
    tableBodyData.push([
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
    ]);
  }

  if (data.customer.due == 0) {
    tableBodyData.push([
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
    ]);
  }

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
        text: `Issued at: ${dateFormat(data.salesDate, 'mmmm d, yyyy')}`,
        alignment: 'center',
        style: 'lessFocused',
      },
      {
        table: {
          widths: [200, '*', '*', '*'],
          body: tableBodyData,
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
      height0: {
        height: 0,
        lineHeight: 0,
      },
    },
  };
};

const GenerateInvoice = async (id, type) => {
  let sale;
  if (type == 'payment') {
    sale = await Sale.findById(id).populate('customer');
  } else {
    sale = await Sale.findById(id).populate('product').populate('customer');
  }
  let pdfDoc = await printer.createPdfKitDocument(docDefinition(sale));
  if (!fs.existsSync(`files/invoice/${id}.pdf`)) {
    pdfDoc.pipe(fs.createWriteStream(`files/invoice/${id}.pdf`));
    pdfDoc.end();
  }
};

module.exports = GenerateInvoice;
