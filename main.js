const debounce = (fn, debounceTime) => {
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
};

const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocompleteList');
const repositoryList = document.getElementById('repositoryList');

searchInput.addEventListener('input', debounce(function(event){
    const query = event.target.value.trim();
    if (query === ''){
        autocompleteList.innerHTML = '';
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            autocompleteList.innerHTML = '';
            data.items.forEach(item =>{
                const li = document.createElement('li');
                li.textContent = item.full_name;
                li.addEventListener('click', () =>{
                    addRepository(item);
                    searchInput.value = '';
                    autocompleteList.innerHTML = '';
                })
                autocompleteList.appendChild(li);
            })
        })
        .catch(error => console.error('Error:', error));     
}, 1000))

function addRepository(repo){
    const li = document.createElement('li');
    li.className = 'repository-item';
    li.innerHTML =`
        <div>
            <div>Name: ${repo.name}</div>
            <div>Owner: ${repo.owner.login}</div>
            <div>Stars: ${repo.stargazers_count}</div>
        </div>
        <button onclick="removeRepository(this)">✖</button>
    `;
    repositoryList.appendChild(li)
}

function removeRepository(button){
    const li = button.closest('li');
    li.remove()
}