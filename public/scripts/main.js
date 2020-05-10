const inputQuery = document.querySelector('.input-query');
const queryGroup = document.querySelector('.input-query-group');

const fetchURI = {
    product: 'https://jsonplaceholder.typicode.com/posts',
};

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

inputQuery.addEventListener('input', () =>
    searchData(inputQuery.value, fetchURI.product)
);
