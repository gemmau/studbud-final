
// Selectors for new category form
const newCategoryForm = document.querySelector('[data-new-category-form]');
const newCategoryInput = document.querySelector('[data-new-category-input]');

// Selector for categories container
const categoriesContainer = document.querySelector('[data-categories]');

// Selector for currently viewing
const currentlyViewing = document.querySelector('[data-currently-viewing]');

// Selector for new todo form
const newTodoForm = document.querySelector('[data-new-todo-form]');
const newTodoSelect = document.querySelector('[data-new-todo-select]');
const newTodoInput = document.querySelector('[data-new-todo-input]');

// Selector for edit todo form
const editTodoForm = document.querySelector('[data-edit-todo-form]');
const editTodoSelect = document.querySelector('[data-edit-todo-select]');
const editTodoInput = document.querySelector('[data-edit-todo-input]');

// Selector for todos container
const todosContainer = document.querySelector('[data-cards]');

// Local storage keys
const LOCAL_STORAGE_CATEGORIES_KEY = 'LOCAL_STORAGE_CATEGORIES_KEY';
const LOCAL_STORAGE_TODOS_KEY = 'LOCAL_STORAGE_TODOS_KEY';
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = 'LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY';

let selectedCategoryId = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY);
let categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) || [];
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)) || [];

// EVENT: Add Category
newCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault(); //so it does not refresh when the page is refreshed 

    const category = newCategoryInput.value; //getting data from input
    const isCategoryEmpty = !category || !category.trim().length;

    if (isCategoryEmpty) {
        return console.log('please enter a task');
    }

    categories.push({ _id: Date.now().toString(), category: category, color: getRandomHexColor() });

    newCategoryInput.value = '';

    saveAndRender();
});

// EVENT: Get Selected Category Id
categoriesContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        if (!e.target.dataset.categoryId) {
            selectedCategoryId = null;
        } else {
            selectedCategoryId = e.target.dataset.categoryId;
        }

        saveAndRender();
    }
});

// EVENT: Get Selected Category Color
categoriesContainer.addEventListener('change', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const newCategoryColor = e.target.value;
        const categoryId = e.target.parentElement.dataset.categoryId;
        const categoryToEdit = categories.find((category) => category._id === categoryId);

        categoryToEdit.color = newCategoryColor;

        saveAndRender();
    }
});

// EVENT: Delete Selected Category
currentlyViewing.addEventListener('click', (e) => { //capture event
    if (e.target.tagName.toLowerCase() === 'span') { //'span' - delete button
        categories = categories.filter((category) => category._id !== selectedCategoryId); 

        todos = todos.filter((todo) => todo.categoryId !== selectedCategoryId); //allows for only the cards to be displayed of the selected category

        selectedCategoryId = null;

        saveAndRender();
    }
});

// EVENT: Add Todo - text from input to display on cards
newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    todos.push({
        _id: Date.now().toString(),
        categoryId: newTodoSelect.value,
        todo: newTodoInput.value,
    });

    newTodoSelect.value = '';
    newTodoInput.value = '';

    saveAndRender();
});

// EVENT: Load Edit Todo Form With Values
//Adding an event listener to the whole container and using if statements to see when the user clicks on the edit and trash icons
let todoToEdit = null;
todosContainer.addEventListener('click', (e) => {
    if (e.target.classList[1] === 'fa-edit') { //comparison operator used to distinguish between the edit(fa-edit) and trash(fa-trash-alt) button 
        newTodoForm.style.display = 'none'; //hides to do form when user clicks on edit button
        editTodoForm.style.display = 'flex'; //displays edit form

        todoToEdit = todos.find((todo) => todo._id === e.target.dataset.editTodo);

        editTodoSelect.value = todoToEdit.categoryId;
        editTodoInput.value = todoToEdit.todo;
    }
    if (e.target.classList[1] === 'fa-trash-alt') {
        const todoToDeleteIndex = todos.findIndex((todo) => todo._id === e.target.dataset.deleteTodo);

        todos.splice(todoToDeleteIndex, 1); //deletes element from array

        saveAndRender();
    }
});

// EVENT: Update The Todo Being Edited With New Values
editTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    todoToEdit.categoryId = editTodoSelect.value;
    todoToEdit.todo = editTodoInput.value;

    editTodoForm.style.display = 'none';
    newTodoForm.style.display = 'flex';

    editTodoSelect.value = '';
    editTodoInput.value = '';

    saveAndRender();
});

// *==================== Functions ====================

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY, selectedCategoryId);
}
//to display the results from the previous 2 functions in the DOM
function render() {
    clearChildElements(categoriesContainer); //to stop items from being re-rendered 
    clearChildElements(newTodoSelect);
    clearChildElements(editTodoSelect);
    clearChildElements(todosContainer);

    renderCategories();
    renderFormOptions();
    renderTodos();

    // Set the current viewing category
    if (!selectedCategoryId || selectedCategoryId === 'null') {
        currentlyViewing.innerHTML = `You are currently viewing <strong>All Categories</strong>`;
    } else {
        const currentCategory = categories.find((category) => category._id === selectedCategoryId);
        currentlyViewing.innerHTML = `You are currently viewing <strong>${currentCategory.category}</strong> <span>(delete)</span>`;
    }
}

function renderCategories() {
    categoriesContainer.innerHTML += `<li class="sidebar-item ${selectedCategoryId === 'null' || selectedCategoryId === null ? 'active' : ''}" data-category-id="">View All</li>
	`;

    categories.forEach(({ _id, category, color }) => {
        categoriesContainer.innerHTML += ` <li class="sidebar-item ${_id === selectedCategoryId ? 'active' : ''}" data-category-id=${_id}>${category}<input class="sidebar-color" type="color" value=${color}></li>`;
    });
}

//Getting the categories into the form
function renderFormOptions() {

    newTodoSelect.innerHTML += `<option value="">Select A Category</option>`;
    editTodoSelect.innerHTML += `<option value="">Select A Category</option>`;
    //This function affects the DOM when the user is choosing a category from the category's that they have added
    //'_id' refers to the categories in the side bar 
    categories.forEach(({ _id, category }) => {
        newTodoSelect.innerHTML += `<option value=${_id}>${category}</option>`;
        editTodoSelect.innerHTML += `<option value=${_id}>${category}</option>`;
    });
}

//Rendering the resource cards 
function renderTodos() {
    let todosToRender = todos;

    // if their is a Selected Category Id, and selected category id !== 'null then filter the todos
    if (selectedCategoryId && selectedCategoryId !== 'null') {
        todosToRender = todos.filter((todo) => todo.categoryId === selectedCategoryId);
    }

    // Render Todos
    todosToRender.forEach(({ _id, categoryId, todo }) => {

        // Get Complimentary categoryDetails Based On TaskId
        //for each todo, loop through the categories 
        const { color, category } = categories.find(({ _id }) => _id === categoryId);
        const backgroundColor = convertHexToRGBA(color, 20);
        todosContainer.innerHTML += `
			<div class="todo" style="border-color: ${color}">
					<div class="todo-tag" style="background-color: ${backgroundColor}; color: ${color};">
						${category}
					</div>
					<p class="todo-description">${todo}</p>
					<div class="todo-actions">
						<i class="far fa-edit" data-edit-todo=${_id}></i>
						<i class="far fa-trash-alt" data-delete-todo=${_id}></i>
					</div>
			</div>`;
    });
}

// HELPERS
//this function affects the 'My Categories' side bar and removes the child elements when rendering 
function clearChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

//Function to change colours of categories and card from HEX to RGB
function convertHexToRGBA(hexCode, opacity) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
}

function getRandomHexColor() {
    var hex = (Math.round(Math.random() * 0xffffff)).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return `#${hex}`;
}

window.addEventListener('load', render);

//Reference - https://www.youtube.com/watch?v=AhILNER5X4Y taught concepts of DOM manipulation and events for the Resource List