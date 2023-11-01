// Chris Schrobilgen
// CSC 337
// Client side javascript to send asynchronous requests to the server using the HTML buttons and text fields

// Utilizing event listeners from the User form and the Item form
document.addEventListener('DOMContentLoaded', () => {
    const addUserForm = document.getElementById('add-user-form');
    const addItemForm = document.getElementById('add-item-form');

    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Send a POST request to /add/user with username and password
        fetch('/add/user', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        });
    });

    addItemForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').value;
        const price = parseFloat(document.getElementById('price').value);
        const status = document.getElementById('status').value;
        const username = document.getElementById('itemUser').value;

        // Send a POST request to /add/user with title, description, image, price, and status
        fetch(`/add/item/${username}`, {
            method: 'POST',
            body: JSON.stringify({ title, description, image, price, status}),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
    });
});
