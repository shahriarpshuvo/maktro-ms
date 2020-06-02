
const fs = require('fs');

const InvoiceController = {}

InvoiceController.sales = async (req, res) => {
    var data = fs.readFileSync(`./${req.params.id}.pdf`);
    res.contentType("application/pdf");
    res.send(data);
}

module.exports = InvoiceController;