const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

const onAddItemSubmit = (e) => {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  // Check for Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }
  // Create item DOM Element
  addItemToDOM(newItem);
  // Add item to local storage
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
};

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  //Add li to the DOM
  itemList.appendChild(li);
}

const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  //Add new item to array
  itemsFromStorage.push(item);
  // Convert To JSON String and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  //Checking to see if there are no values in storage
  if (localStorage.getItem('items') === null) {
    //if there isn't, variable is set to empty array
    itemsFromStorage = [];
  } else {
    //if there are items in storage, parsing them into an array and putting them in the variable
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  // .includes can be used on an array to see if item is included
  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    return false;
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  // item.style.color = '#ccc';
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#CAE6EE';
  formBtn.style.color = 'red';
  formBtn.style.fontWeight = 'bolder';
  // Set value because its an input
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();
    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const clearItems = () => {
  // itemList.innerHTML = ''; //optimized way below
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from localStorage
  localStorage.removeItem('items');
  checkUI();
};

function filterItems(e) {
  //capture text and make lowercase
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  // console.log(text);
}

function checkUI() {
  // Clear input when UI is checked or reset
  itemInput.value = '';
  //Needs to be inside function to check when list items are added
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  formBtn.style.color = 'white';
  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();
