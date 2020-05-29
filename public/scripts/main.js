const host = 'http://localhost:8000/api';

const inputQuery = document.querySelector('.input-query');
const queryGroup = document.querySelector('.input-query-group');

const fetchURI = {
    products: `${host}/products`,
};

const searchData = async (keyword, fetchURI) => {
    const res = await fetch(fetchURI);
    const data = await res.json();
    console.log(data);
    let matches = data.filter((datum) => {
        const regex = new RegExp(`^${keyword}`, 'gi');
        return datum.name.match(regex);
    });
    if (keyword.length === 0) {
        matches = [];
        queryGroup.innerHTML = '';
    }
    outputData(matches);
};

const outputData = (matches) => {
    if (matches.length > 0) {
        const htmlElements = matches
            .map(
                (match) =>
                    `<li class="list-group-item input-query-data">
                    ${match.title}
                    </li>`
            )
            .join('');
        queryGroup.innerHTML = htmlElements;
        const queryData = document.querySelectorAll('.input-query-data');
        for (let queryDatum of queryData) {
            queryDatum.addEventListener('click', () => {
                inputQuery.value = queryDatum.innerText;
                queryGroup.innerHTML = '';
            });
        }
    }
};

inputQuery.addEventListener('input', () =>
    searchData(inputQuery.value, 'http://localhost:8000/api/products')
);






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
const path = document.querySelector('[data-item-types]').getAttribute('data-item-types');
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
            const res = await fetch(`${host}/products/${ItemID}`);
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




/**************************************
 * Enhanced Bootstrap Functionality
 **************************************/

// Alert Animation
window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function() {
        $(this).hide();
    });
}, 5000);

// Clear Form Field
$('[data-dismiss="modal"]').on('click', function(){
    document.querySelector('form').reset()
})