const protocol = location.protocol;
const slashes = protocol.concat('//');
const host = slashes.concat(window.location.host);
const hostAPI = host + '/api';

const fetchURI = {
  products: `${hostAPI}/products`,
  customers: `${hostAPI}/customers`,
};

/***********************
 *  Live Search Result
 **********************/
const searchData = async (
  keyword,
  fetchURI,
  types,
  matchValue,
  matchTitle,
  inputQuery,
  queryGroup
) => {
  const res = await fetch(fetchURI);
  const data = await res.json();
  let matches = data.filter((datum) => {
    const regex = new RegExp(`^${keyword}`, 'gi');
    return datum[matchValue].match(regex);
  });
  if (keyword.length === 0) {
    matches = [];
    queryGroup.innerHTML = '';
  }
  outputData(matches, types, matchValue, matchTitle, inputQuery, queryGroup);
};

const outputData = (
  matches,
  types,
  matchValue,
  matchTitle,
  inputQuery,
  queryGroup
) => {
  if (matches.length > 0) {
    const htmlElements = matches
      .map(
        (match) =>
          `<li class="list-group-item ${types}-input-query-data">
                        <span>${match[matchValue]}</span>
                        <span class="text-muted">(${match[matchTitle]})</span>
                    </li>`
      )
      .join('');
    queryGroup.innerHTML = htmlElements;
    const queryData = document.querySelectorAll(`.${types}-input-query-data`);
    for (let queryDatum of queryData) {
      queryDatum.addEventListener('click', () => {
        const value = queryDatum.children[0];
        inputQuery.value = value.innerText;
        queryGroup.innerHTML = '';
      });
    }
  }
};

const productInputQuery = document.querySelector('.product-input-query');
const productQueryGroup = document.querySelector('.product-input-query-group');
if (productInputQuery) {
  productInputQuery.addEventListener('input', () =>
    searchData(
      productInputQuery.value,
      fetchURI.products,
      'product',
      'code',
      'name',
      productInputQuery,
      productQueryGroup
    )
  );
}

const customerInputQuery = document.querySelector('.customer-input-query');
const customerQueryGroup = document.querySelector(
  '.customer-input-query-group'
);
if (customerInputQuery) {
  customerInputQuery.addEventListener('input', () =>
    searchData(
      customerInputQuery.value,
      fetchURI.customers,
      'customer',
      'phone',
      'name',
      customerInputQuery,
      customerQueryGroup
    )
  );
}

/************************
 * Delete Functionality
 *************************/

function deleteItemTrigger(path) {
  const deleteForm = document.querySelector('.delete-form');
  const deleteButtons = document.querySelectorAll(
    '[data-target="#deleteModal"]'
  );
  if (deleteButtons) {
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const ItemID = btn.parentElement.getAttribute('data-item-id');
        deleteForm.setAttribute(
          'action',
          `${host}/${path}/${ItemID}?_method=delete`
        );
      });
    });
  }
}

//DeleteItems
const dataItemTypes = document.querySelector('[data-item-types]');
let path;
if (dataItemTypes) path = dataItemTypes.getAttribute('data-item-types');
deleteItemTrigger(path);

/**************************
 * => Get User & Edit
 * ***********************/
const userForm = document.querySelector('.userForm');
const userFormTitle = document.querySelector('.userForm-title');
const userFormName = document.querySelector('.userForm-name');
const userFormEmail = document.querySelector('.userForm-email');
const userFormRole = document.querySelector('.userForm-role');
const userEditButtons = document.querySelectorAll('.userEditButton');
if (userEditButtons) {
  userEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/users/${ItemID}`);
      const data = await res.json();
      userForm.setAttribute('action', `/users/${ItemID}?_method=patch`);
      userFormTitle.innerText = 'Edit User';
      userFormName.value = data.name;
      userFormEmail.value = data.email;
      userFormEmail.setAttribute('disabled', 'true');
      userFormRole.value = data.role;
      $('[data-dismiss="modal"]').on('click', function () {
        userForm.reset();
        userFormTitle.innerText = 'Add New User';
        userFormEmail.removeAttribute('disabled');
        userForm.setAttribute('action', '/users');
      });
    });
  });
}
/**************************
 * => Get Product & Edit
 * ***********************/
const productForm = document.querySelector('.productForm');
const productFormTitle = document.querySelector('.productForm-title');
const productFormName = document.querySelector('.productForm-name');
const productFormCode = document.querySelector('.productForm-code');
const productFormRate = document.querySelector('.productForm-rate');
const productEditButtons = document.querySelectorAll('.productEditButton');
if (productEditButtons) {
  productEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/products/${ItemID}`);
      const data = await res.json();
      productForm.setAttribute('action', `/products/${ItemID}?_method=patch`);
      productFormTitle.innerText = 'Edit Product';
      productFormName.value = data.name;
      productFormCode.value = data.code;
      productFormCode.setAttribute('disabled', 'true');
      productFormRate.value = data.rate;
      $('[data-dismiss="modal"]').on('click', function () {
        productForm.reset();
        productFormTitle.innerText = 'Add New Product';
        productFormCode.removeAttribute('disabled');
        productForm.setAttribute('action', '/products');
      });
    });
  });
}

/*******************************
 * Get Entries and Edit
 *******************************/

const inventoryForm = document.querySelector('.inventoryForm');
const inventoryFormTitle = document.querySelector('.inventoryForm-title');
const inventoryFormProduct = document.querySelector('.inventoryForm-product');
const inventoryFormQuantity = document.querySelector('.inventoryForm-quantity');
const inventoryEditButtons = document.querySelectorAll('.inventoryEditButton');

if (inventoryEditButtons) {
  inventoryEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/entries/${ItemID}`);
      const data = await res.json();
      inventoryForm.setAttribute('action', `/entries/${ItemID}?_method=patch`);
      inventoryFormTitle.innerText = 'Edit Inventory';
      inventoryFormProduct.value = data.product;
      inventoryFormProduct.setAttribute('disabled', 'true');
      inventoryFormQuantity.value = data.quantity;
      $('[data-dismiss="modal"]').on('click', function () {
        inventoryForm.reset();
        inventoryFormTitle.innerText = 'Add New inventory';
        inventoryFormProduct.removeAttribute('disabled');
        inventoryForm.setAttribute('action', '/entries');
      });
    });
  });
}

/*******************************
 * Get Servicing and Edit
 *******************************/
const servicingForm = document.querySelector('.servicingForm');
const servicingFormTitle = document.querySelector('.servicingForm-title');
const servicingFormName = document.querySelector('.servicingForm-name');
const servicingFormAddress = document.querySelector('.servicingForm-address');
const servicingFormPhone = document.querySelector('.servicingForm-phone');
const servicingFormProduct = document.querySelector('.servicingForm-product');
const servicingFormQuantity = document.querySelector('.servicingForm-quantity');
const servicingFormServiceCharge = document.querySelector(
  '.servicingForm-serviceCharge'
);
const servicingFormDeliveryDate = document.querySelector(
  '.servicingForm-deliveryDate'
);
const servicingFormStatus = document.querySelector('.servicingForm-status');
const servicingEditButtons = document.querySelectorAll('.servicingEditButton');

if (servicingEditButtons) {
  servicingEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/servicing/${ItemID}`);
      const {
        name,
        address,
        phone,
        product,
        quantity,
        serviceCharge,
        deliveryDate,
        status,
      } = await res.json();
      servicingForm.setAttribute(
        'action',
        `/servicing/${ItemID}?_method=patch`
      );
      servicingFormTitle.innerText = 'Edit Servicing';
      servicingFormName.value = name;
      servicingFormAddress.value = address;
      servicingFormPhone.value = phone;
      servicingFormProduct.value = product.code;
      servicingFormQuantity.value = quantity;
      servicingFormServiceCharge.value = serviceCharge;
      servicingFormServiceCharge.setAttribute('required', 'true');
      servicingFormDeliveryDate.valueAsDate = new Date(deliveryDate);
      servicingFormStatus.value = status;
      servicingFormProduct.setAttribute('disabled', 'true');
      $('[data-dismiss="modal"]').on('click', function () {
        servicingForm.reset();
        servicingFormTitle.innerText = 'Add New Servicing';
        servicingFormProduct.removeAttribute('disabled');
        servicingFormServiceCharge.removeAttribute('required');
        servicingForm.setAttribute('action', '/servicing');
      });
    });
  });
}

/*******************************
 * Get Expense and Edit
 *******************************/
const expenseForm = document.querySelector('.expenseForm');
const expenseFormTitle = document.querySelector('.expenseForm-title');
const expenseFormPurpose = document.querySelector('.expenseForm-purpose');
const expenseFormEquipments = document.querySelector('.expenseForm-equipments');
const expenseFormTransports = document.querySelector('.expenseForm-transports');
const expenseFormSalaryUtilities = document.querySelector(
  '.expenseForm-salaryUtilities'
);
const expenseFormRetailHoldings = document.querySelector(
  '.expenseForm-retailHoldings'
);
const expenseFormMarketing = document.querySelector('.expenseForm-marketing');
const expenseFormStationeryTools = document.querySelector(
  '.expenseForm-stationeryTools'
);
const expenseFormCourierCommission = document.querySelector(
  '.expenseForm-courierCommission'
);
const expenseFormOthers = document.querySelector('.expenseForm-others');
const expenseFormExpenseDate = document.querySelector(
  '.expenseForm-expenseDate'
);
const expenseEditButtons = document.querySelectorAll('.expenseEditButton');

if (expenseEditButtons) {
  expenseEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/expenses/${ItemID}`);
      const {
        purpose,
        equipments,
        transports,
        courierCommission,
        retailHoldings,
        stationeryTools,
        salaryUtilities,
        marketing,
        others,
        expenseDate,
        createdAt,
      } = await res.json();
      expenseForm.setAttribute('action', `/expenses/${ItemID}?_method=patch`);
      expenseFormTitle.innerText = 'Edit Expense';
      expenseFormPurpose.value = purpose;
      expenseFormEquipments.value = equipments;
      expenseFormTransports.value = transports;
      expenseFormCourierCommission.value = courierCommission;
      expenseFormRetailHoldings.value = retailHoldings;
      expenseFormStationeryTools.value = stationeryTools;
      expenseFormSalaryUtilities.value = salaryUtilities;
      expenseFormMarketing.value = marketing;
      expenseFormOthers.value = others;
      if (expenseDate)
        expenseFormExpenseDate.valueAsDate = new Date(expenseDate);
      else expenseFormExpenseDate.valueAsDate = new Date(createdAt);
      expenseFormExpenseDate.setAttribute('required', 'true');
      $('[data-dismiss="modal"]').on('click', function () {
        expenseForm.reset();
        expenseFormTitle.innerText = 'Add New Expense';
        expenseFormExpenseDate.removeAttribute('required');
        expenseForm.setAttribute('action', '/expenses');
      });
    });
  });
}

/*******************************
 * Get Customer and Edit
 *******************************/
const customerForm = document.querySelector('.customerForm');
const customerFormTitle = document.querySelector('.customerForm-title');
const customerFormName = document.querySelector('.customerForm-name');
const customerFormAddress = document.querySelector('.customerForm-address');
const customerFormPhone = document.querySelector('.customerForm-phone');
const customerFormAmount = document.querySelector('.customerForm-amount');
const customerFormPaid = document.querySelector('.customerForm-paid');
const customerEditButtons = document.querySelectorAll('.customerEditButton');

if (customerEditButtons) {
  customerEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/customers/${ItemID}`);
      const { name, address, phone, amount, paid } = await res.json();
      customerForm.setAttribute('action', `/customers/${ItemID}?_method=patch`);
      customerFormTitle.innerText = 'Edit Customer';
      customerFormName.value = name;
      customerFormAddress.value = address;
      customerFormPhone.value = phone;
      customerFormAmount.value = amount;
      customerFormPaid.value = paid;
      customerFormAmount.setAttribute('disabled', 'true');
      customerFormPaid.setAttribute('disabled', 'true');
      $('[data-dismiss="modal"]').on('click', function () {
        customerForm.reset();
        customerFormTitle.innerText = 'Add New Customer';
        customerFormAmount.removeAttribute('disabled');
        customerFormPaid.removeAttribute('disabled');
        customerForm.setAttribute('action', '/customers');
      });
    });
  });
}

/*******************************
 * Get Sales and Edit
 *******************************/
const saleForm = document.querySelector('.saleForm');
const saleFormTitle = document.querySelector('.saleForm-title');
const saleFormCustomer = document.querySelector('.saleForm-customer');
const saleFormProduct = document.querySelector('.saleForm-product');
const saleFormQuantity = document.querySelector('.saleForm-quantity');
const saleFormRate = document.querySelector('.saleForm-rate');
const saleFormShippingCost = document.querySelector('.saleForm-shippingCost');
const saleFormDiscount = document.querySelector('.saleForm-discount');
const saleFormPaid = document.querySelector('.saleForm-paid');
const saleFormSalesDate = document.querySelector('.saleForm-salesDate');
const saleFormComment = document.querySelector('.saleForm-comment');
const saleEditButtons = document.querySelectorAll('.saleEditButton');

if (saleEditButtons) {
  saleEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/sales/${ItemID}`);
      const {
        entry,
        customer,
        product,
        quantity,
        rate,
        shippingCost,
        discount,
        paid,
        salesDate,
        comment,
      } = await res.json();
      saleForm.setAttribute('action', `/sales/${ItemID}?_method=patch`);
      saleForm.insertAdjacentHTML(
        'afterbegin',
        `<input id="entryHiddenField" type="hidden" name="entry" value="${entry}">`
      );
      saleFormTitle.innerText = 'Edit Sales Information';
      saleFormCustomer.value = customer;
      saleFormProduct.value = product;
      saleFormQuantity.value = quantity;
      saleFormRate.value = rate;
      saleFormShippingCost.value = shippingCost;
      saleFormDiscount.value = discount;
      saleFormPaid.value = paid;
      saleFormSalesDate.valueAsDate = new Date(salesDate);
      saleFormComment.value = comment;
      saleFormCustomer.setAttribute('disabled', 'true');
      saleFormProduct.setAttribute('readonly', 'true');
      $('[data-dismiss="modal"]').on('click', function () {
        saleForm.reset();
        const hiddenField = document.getElementById('entryHiddenField');
        hiddenField.remove();
        saleFormTitle.innerText = 'Add New Sales';
        saleFormCustomer.removeAttribute('disabled');
        saleFormProduct.removeAttribute('disabled');
        saleForm.setAttribute('action', '/sales');
      });
    });
  });
}

/*******************************
 * Get Returns and Edit
 *******************************/
const returnForm = document.querySelector('.returnForm');
const returnFormTitle = document.querySelector('.returnForm-title');
const returnFormCustomer = document.querySelector('.returnForm-customer');
const returnFormProduct = document.querySelector('.returnForm-product');
const returnFormQuantity = document.querySelector('.returnForm-quantity');
const returnFormAmount = document.querySelector('.returnForm-amount');
const returnFormReturnDate = document.querySelector('.returnForm-returnDate');
const returnEditButtons = document.querySelectorAll('.returnEditButton');

if (returnEditButtons) {
  returnEditButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ItemID = btn.parentElement.getAttribute('data-item-id');
      const res = await fetch(`${hostAPI}/returns/${ItemID}`);
      const { entry, customer, product, quantity, amount, returnDate } =
        await res.json();
      returnForm.setAttribute('action', `/returns/${ItemID}?_method=patch`);
      returnForm.insertAdjacentHTML(
        'afterbegin',
        `<input id="entryHiddenField" type="hidden" name="entry" value="${entry}">`
      );
      returnFormTitle.innerText = 'Edit Return Information';
      returnFormCustomer.value = customer;
      returnFormProduct.value = product;
      returnFormQuantity.value = quantity;
      returnFormAmount.value = amount;
      returnFormReturnDate.valueAsDate = new Date(returnDate);
      returnFormCustomer.setAttribute('disabled', 'true');
      returnFormProduct.setAttribute('readonly', 'true');
      $('[data-dismiss="modal"]').on('click', function () {
        returnForm.reset();
        const hiddenField = document.getElementById('entryHiddenField');
        hiddenField.remove();
        returnFormTitle.innerText = 'Add New Return';
        returnFormCustomer.removeAttribute('disabled');
        returnFormProduct.removeAttribute('disabled');
        returnForm.setAttribute('action', '/returns');
      });
    });
  });
}

/*********
 * Pagination
 *
 */

/**************************************
 * Enhanced Bootstrap Functionality
 **************************************/
// Clear Form Field
$('[data-dismiss="modal"]').on('click', function () {
  document.querySelector('form').reset();
});

// Alert Animation
window.setTimeout(function () {
  $('.alert')
    .fadeTo(500, 0)
    .slideUp(500, function () {
      $(this).hide();
    });
}, 6000);
