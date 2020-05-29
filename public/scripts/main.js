const host = 'http://localhost:8000';
const hostAPI = 'http://localhost:8000/api';
const fetchURI = {
    products: `${hostAPI}/products`,
    customers: `${hostAPI}/customers`
};

/***********************
 *  Live Search Result
 **********************/
const searchData = async (keyword, fetchURI, types, matchValue, matchTitle, inputQuery, queryGroup) => {
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

const outputData = (matches, types, matchValue, matchTitle, inputQuery, queryGroup) => {
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
        console.log(`${types}-input-query-data`);
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
if(productInputQuery){
    productInputQuery.addEventListener('input', () =>
        searchData(productInputQuery.value, fetchURI.products, 'product', 'code', 'name', productInputQuery, productQueryGroup)
    );
}



/************************
 * Delete Functionality
 *************************/

function deleteItemTrigger(path){
    const deleteForm = document.querySelector('.delete-form');
    const deleteButtons = document.querySelectorAll('[data-target="#deleteModal"]');
    if(deleteButtons){
        deleteButtons.forEach((btn)=>{
            btn.addEventListener('click', ()=>{
                const ItemID = btn.parentElement.getAttribute('data-item-id');
                deleteForm.setAttribute('action', `${host}/${path}/${ItemID}?_method=delete`)
                console.log(`${host}/${path}/${ItemID}?_method=delete`);
            })
        })
    }
}

//DeleteItems
const dataItemTypes = document.querySelector('[data-item-types]');
let path;
if(dataItemTypes) path = dataItemTypes.getAttribute('data-item-types');
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
if(userEditButtons){
    userEditButtons.forEach((btn)=>{
        btn.addEventListener('click', async()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            const res = await fetch(`${host}/users/${ItemID}`);
            const data = await res.json();
            userForm.setAttribute('action', `/users/${ItemID}?_method=patch`);
            userFormTitle.innerText = "Edit User";
            userFormName.value = data.name;
            userFormEmail.value = data.email;
            userFormEmail.setAttribute('disabled', 'true');
            userFormRole.value = data.role;
            $('[data-dismiss="modal"]').on('click', function(){
                userForm.reset();
                userFormTitle.innerText = "Add New User";
                userFormEmail.removeAttribute('disabled')
                userForm.setAttribute('action', '/users');
            })
        })
    })
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
if(productEditButtons){
    productEditButtons.forEach((btn)=>{
        btn.addEventListener('click', async()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            const res = await fetch(`${hostAPI}/products/${ItemID}`);
            const data = await res.json();
            productForm.setAttribute('action', `/products/${ItemID}?_method=patch`);
            productFormTitle.innerText = "Edit Product";
            productFormName.value = data.name;
            productFormCode.value = data.code;
            productFormCode.setAttribute('disabled', 'true');
            productFormRate.value = data.rate;
            $('[data-dismiss="modal"]').on('click', function(){
                productForm.reset();
                productFormTitle.innerText = "Add New Product";
                productFormCode.removeAttribute('disabled')
                productForm.setAttribute('action', '/products');
            })
        })
    })
}

/*******************************
 * Get Entries and Edit
 *******************************/

const inventoryForm = document.querySelector('.inventoryForm');
const inventoryFormTitle = document.querySelector('.inventoryForm-title');
const inventoryFormProduct = document.querySelector('.inventoryForm-product');
const inventoryFormQuantity = document.querySelector('.inventoryForm-quantity');
const inventoryEditButtons = document.querySelectorAll('.inventoryEditButton');

if(inventoryEditButtons){
    inventoryEditButtons.forEach((btn)=>{
        btn.addEventListener('click', async()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            const res = await fetch(`${hostAPI}/entries/${ItemID}`);
            const data = await res.json();
            inventoryForm.setAttribute('action', `/entries/${ItemID}?_method=patch`);
            inventoryFormTitle.innerText = "Edit Inventory";
            inventoryFormProduct.value = data.product;
            inventoryFormProduct.setAttribute('disabled', 'true');
            inventoryFormQuantity.value = data.quantity;
            $('[data-dismiss="modal"]').on('click', function(){
                inventoryForm.reset();
                inventoryFormTitle.innerText = "Add New inventory";
                inventoryFormProduct.removeAttribute('disabled')
                inventoryForm.setAttribute('action', '/entries');
            })
        })
    })
}

/*******************************
 * Get Serving and Edit
 *******************************/
const servicingForm = document.querySelector('.servicingForm');
const servicingFormTitle = document.querySelector('.servicingForm-title');
const servicingFormName = document.querySelector('.servicingForm-name');
const servicingFormAddress = document.querySelector('.servicingForm-address');
const servicingFormPhone = document.querySelector('.servicingForm-phone');
const servicingFormProduct = document.querySelector('.servicingForm-product');
const servicingFormQuantity = document.querySelector('.servicingForm-quantity');
const servicingFormDeliveryDate = document.querySelector('.servicingForm-deliveryDate');
const servicingFormStatus = document.querySelector('.servicingForm-status');
const servicingEditButtons = document.querySelectorAll('.servicingEditButton');

if(servicingEditButtons){
    servicingEditButtons.forEach((btn)=>{
        btn.addEventListener('click', async()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            const res = await fetch(`${hostAPI}/servicing/${ItemID}`);
            const { name, address, phone, product, quantity, deliveryDate, status } = await res.json();
            servicingForm.setAttribute('action', `/servicing/${ItemID}?_method=patch`);
            servicingFormTitle.innerText = "Edit Servicing";
            servicingFormName.value = name;
            servicingFormAddress.value = address;
            servicingFormPhone.value = phone;
            servicingFormProduct.value = product.code;
            servicingFormQuantity.value = quantity;
            servicingFormDeliveryDate.valueAsDate = new Date(deliveryDate);
            servicingFormStatus.value = status;
            servicingFormProduct.setAttribute('disabled', 'true');
            $('[data-dismiss="modal"]').on('click', function(){
                servicingForm.reset();
                servicingFormTitle.innerText = "Add New Servicing";
                servicingFormProduct.removeAttribute('disabled')
                servicingForm.setAttribute('action', '/entries');
            })
        })
    })
}


/**************************************
 * Enhanced Bootstrap Functionality
 **************************************/
// Clear Form Field
$('[data-dismiss="modal"]').on('click', function(){
    document.querySelector('form').reset()
})

// Alert Animation
window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function() {
        $(this).hide();
    });
}, 5000);

