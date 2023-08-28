// Retrieve stored todo list items or initialize an empty array
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

// Retrieve stored completed items or initialize an empty array
let completedList = JSON.parse(localStorage.getItem("completedList")) || [];

// Get references to DOM elements
const inputText = document.getElementById("text-input");
const myForm = document.getElementById("my-form");
const todoContainer = document.getElementById("todo-pending");
const completedContainer = document.getElementById("todo-completed");

// Loop through existing todo items and create corresponding HTML
todoList.forEach((todo) => {
  createHtml(todo.name, todo.todoId);
});

// Loop through completed items and create corresponding HTML
completedList.forEach((completedTodo) => {
  createCompHtml(completedTodo.name, completedTodo.todoId);
});

// Function to create a new todo item object
function createTodoItem(name, id) {
  return { name: name, todoId: id, isCompleted: false };
}

// Event listener for form submission
myForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Show the activeTitle when a new todo item is added
  const activeTitle = document.getElementById("active");
  activeTitle.style.display = "block";

  // Get input value and handle empty input
  const text = inputText.value;
  const errorBox = document.createElement("div");
  errorBox.classList.add("error");
  errorBox.textContent = "Input is empty";
  if (text === "") {
    myForm.appendChild(errorBox);
    setTimeout(() => (errorBox.style.display = "none"), 1000);
    return;
  }

  // Create timestamp for todoId
  const currentDate = new Date();
  const timeStamp = currentDate.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  // Create new todo item and update lists
  const todoId = timeStamp;
  const todoItem = createTodoItem(text, todoId);
  todoList.push(todoItem);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  createHtml(text, todoId);
  inputText.value = "";
});

// Function to create HTML for an active todo item
function createHtml(text, todoId) {
  const container = document.createElement("div");
  container.classList.add("todo-item");
  const parag = document.createElement("input");
  parag.value = text;
  parag.disabled = true;

  const time = document.createElement("span");
  time.textContent = todoId;

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove");
  removeButton.textContent = "-";
  removeButton.addEventListener("click", () => {
    removeTodo(container, todoId);
  });

  const btnSection = document.createElement("div");
  btnSection.style = "display : flex ; gap : 10px ";

  const editButton = document.createElement("button");
  editButton.classList.add("edbtn");
  editButton.addEventListener("click", () => editTodo(parag));

  const doneButton = document.createElement("button");
  doneButton.classList.add("done");
  doneButton.textContent = "✓";

  doneButton.addEventListener("click", () => {
    completeTodo(container, todoId);
    const completedHeading = document.getElementById("comph3");
    completedHeading.style.display = "block";
  });

  btnSection.append(doneButton, editButton, removeButton);
  container.append(parag, time, btnSection);
  todoContainer.appendChild(container);
}

// Function to mark a todo item as completed
function completeTodo(el, todoId) {
  const todoIndex = todoList.findIndex((todo) => todo.todoId === todoId);
  if (todoIndex !== -1) {
    const completedTodo = todoList.splice(todoIndex, 1)[0];
    completedTodo.isCompleted = true;
    completedList.push(completedTodo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    localStorage.setItem("completedList", JSON.stringify(completedList));
    removeTodo(el, todoId);
    createCompHtml(completedTodo.name, completedTodo.todoId);
  }
}

// Function to remove a todo item
function removeTodo(el, todoId) {
  todoList = todoList.filter((todo) => todo.todoId !== todoId);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  el.remove();
  const activeItems = [...todoList];
  const activeTitle = document.getElementById("active");
  if (activeItems.length === 0) {
    activeTitle.style.display = "none";
  } else {
    activeTitle.style.display = "block";
  }
}

// Function to remove a completed todo item
function removeCompTodo(el, todoId) {
  completedList = completedList.filter((todo) => todo.todoId !== todoId);
  const completedHeading = document.getElementById("comph3");
  const activeItems = [...completedList];
  localStorage.setItem("completedList", JSON.stringify(completedList));
  el.remove();
  if (activeItems.length === 0) {
    completedHeading.style.display = "none";
  } else {
    completedHeading.style.display = "block";
  }
}

// Function to enable editing of a todo item
function editTodo(parag) {
  parag.disabled = false;
  parag.focus();

  parag.addEventListener("change", function () {
    parag.disabled = true;
  });
}

// Function to create HTML for a completed todo item
function createCompHtml(text, todoId) {
  const container = document.createElement("div");
  container.classList.add("todo-item-comp");

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  const time = document.createElement("span");
  time.textContent = todoId;

  const compRemoveBtn = document.createElement("button");
  compRemoveBtn.classList.add("compRemoveBtn");
  compRemoveBtn.textContent = "-";
  compRemoveBtn.addEventListener("click", () =>
    removeCompTodo(container, todoId)
  );

  container.append(paragraph, time, compRemoveBtn);
  completedContainer.appendChild(container);
}
