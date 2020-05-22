
const inputQuery = document.querySelector('.input-query');
const queryGroup = document.querySelector('.input-query-group');

const host = 'http://localhost:8000'

const fetchURI = {
    product: 'https://jsonplaceholder.typicode.com/posts',
};
console.log();
const searchData = async (keyword, fetchURI) => {
    const res = await fetch(fetchURI);
    const data = await res.json();
    let matches = data.filter((datum) => {
        const regex = new RegExp(`^${keyword}`, 'gi');
        return datum.title.match(regex);
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

// inputQuery.addEventListener('input', () =>
//     searchData(inputQuery.value, fetchURI.product)
// );

// Delete

const deleteForm = document.querySelector('.delete-form');
const deleteButtons = document.querySelectorAll('[data-target="#deleteModal"]');

if(deleteButtons){
    deleteButtons.forEach((btn)=>{
        btn.addEventListener('click', ()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            deleteForm.setAttribute('action', `${host}/users/${ItemID}?_method=delete`)
        })
    })
}


//Get User & Edit
const userForm = document.querySelector('.userForm');
const userFormTitle = document.querySelector('.userForm-title');
const userFormName = document.querySelector('.userForm-name');
const userFormEmail = document.querySelector('.userForm-email');
const userFormRole = document.querySelector('.userForm-role');
const userEditButtons = document.querySelectorAll('[data-target="#addUser"]');
if(userEditButtons){
    userEditButtons.forEach((btn)=>{
        btn.addEventListener('click', async()=>{
            const ItemID = btn.parentElement.getAttribute('data-item-id');
            console.log(ItemID);
            const res = await fetch(`http://localhost:8000/users/${ItemID}`);
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
                userForm.setAttribute('action', `/users`);
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
}, 3000);

// Clear Form Field
$('[data-dismiss="modal"]').on('click', function(){
    document.querySelector('form').reset()
})