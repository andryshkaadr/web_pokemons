const API = 'https://pokeapi.co/api/v2/pokemon/';
let users = [];

const $container = document.querySelector('.search-field');
const $listContainer = document.querySelector('.users-list');
const $field = document.querySelector('.field');
const $listLength = document.querySelector('.user-counter');

function templateBuilder(list) {
    $listLength.innerHTML = users.length + ' users';
    let template = '';
    if (!list.length) {
        template = '<li><span>Not Found</span></li>';
    } else {
        list.forEach(element => {
            template += 
            `<li>
                <a class="name">${element.name}</a>
                <button class="delete-button" data-name="${element.name}">Delete</button>
              </li>`;
        });
    }
    $listContainer.innerHTML = template;
}

function filterController(query) {
    let filteredUsers = users.filter((el) => {
        return ~el.name.toLowerCase().indexOf(query.toLowerCase());
    });
    templateBuilder(filteredUsers);
    notEmptyChecking(filteredUsers);
}

const storedUsers = localStorage.getItem('users');
if (storedUsers) {
    users = JSON.parse(storedUsers);
    templateBuilder(users);
} 
else {
    fetch(API)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            users = data.results;
            localStorage.setItem('users', JSON.stringify(users));
            templateBuilder(users);
        });
}

$field.addEventListener('input', (e) => {
    let query = e.target.value;
    filterController(query);
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        let target = e.target.innerText;
        $field.value = target;
        filterController(target);
    } 
    else if (e.target.classList.contains('delete-button')) {
        let name = e.target.dataset.name;
        deleteUser(name);
    }
});

function deleteUser(name) {
    users = users.filter(user => user.name !== name);
    localStorage.setItem('users', JSON.stringify(users));
    templateBuilder(users);
    notEmptyChecking(users);
}

function notEmptyChecking(filteredUsers) {
    if (filteredUsers.length === 0 && users.length === 0) {
        fetch(API)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                users = data.results;
                localStorage.setItem('users', JSON.stringify(users));
                templateBuilder(users);
            });
    }
}

$field.addEventListener('focus', () => {
    $container.classList.add('active');
});
$field.addEventListener('blur', () => {
    $container.classList.remove('active');
});