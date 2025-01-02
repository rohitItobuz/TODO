const storedArray = localStorage.getItem("array");
let todoArr = storedArray ? JSON.parse(storedArray) : [];

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const completeBtn = document.getElementById("complete");
const clearBtn = document.getElementById("clear");
const filterBtns = document.querySelectorAll(".filter-button");
const alert = document.querySelector(".alert");

const createList = ({ value, active, dateTime }, index, count) => {
  const newTask = document.createElement("div");
  const taskDateTime = document.createElement("p");
  const taskContent = document.createElement("div");
  const taskName = document.createElement("p");
  const taskBtnContainer = document.createElement("div");
  const checkBtn = document.createElement("button");
  const checkIcon = document.createElement("img");
  const deleteBtn = document.createElement("button");
  const deleteIcon = document.createElement("img");
  const editBtn = document.createElement("button");
  const editIcon = document.createElement("img");

  taskName.textContent = value;
  taskName.setAttribute(
    "class",
    "task-name fs-5 mb-0 overflow-scroll rounded-1 px-1"
  );
  taskName.setAttribute("onMouseOut", `showList()`);
  taskName.setAttribute("onkeypress", `updateTask(${index}, ${count}, event)`);

  const currentDateTime = new Date(dateTime);
  taskDateTime.textContent =
    currentDateTime.toDateString() + " " + currentDateTime.toLocaleTimeString();
  taskDateTime.setAttribute("class", "mb-2 text-secondary fst-italic");

  checkIcon.src = "images/checked.png";
  checkIcon.classList.add("task-icon");

  checkBtn.setAttribute("class", "border-0 checkTask");
  checkBtn.setAttribute("onClick", `completeTask(${index})`);
  checkBtn.appendChild(checkIcon);

  deleteIcon.src = "images/trash-bin.png";
  deleteIcon.classList.add("task-icon");

  deleteBtn.classList.add("border-0");
  deleteBtn.setAttribute("onClick", `deleteTask(${index})`);
  deleteBtn.appendChild(deleteIcon);

  editIcon.src = "images/edit.png";
  editIcon.classList.add("task-icon");

  editBtn.classList.add("border-0");
  editBtn.setAttribute("onClick", `editTask(${count})`);
  editBtn.appendChild(editIcon);

  if (!active) {
    taskName.classList.add("text-decoration-line-through");
    editBtn.setAttribute("disabled", "true");
    editBtn.style.cursor = "not-allowed";
  }

  taskBtnContainer.append(checkBtn, editBtn, deleteBtn);
  taskContent.append(taskName, taskBtnContainer);
  taskContent.setAttribute("class", "d-flex justify-content-between");
  newTask.append(taskDateTime, taskContent);
  newTask.setAttribute("class", "p-2 m-auto rounded-1 mb-3 task-container");
  todoList.appendChild(newTask);
};

const showList = () => {
  todoList.innerHTML = "";
  localStorage.setItem("array", JSON.stringify(todoArr));

  if (allBtn.classList.contains("active")) {
    todoArr.forEach((obj, index) => createList(obj, index, index));
  } else if (completeBtn.classList.contains("active")) {
    let count = 0;
    todoArr.forEach((obj, index) => {
      if (!obj.active) {
        createList(obj, index, count);
        count++;
      }
    });
  } else if (activeBtn.classList.contains("active")) {
    let count = 0;
    todoArr.forEach((obj, index) => {
      if (obj.active) {
        createList(obj, index, count);
        count++;
      }
    });
  }
};

const showAlert = (alertMessage) => {
  alert.style.display = "block";
  alert.textContent = alertMessage;

  setTimeout(() => {
    alert.style.display = "none";
  }, 5000);
};

const checkValidTask = (taskName) => {
  if (taskName === "") {
    showAlert("Enter any task name!");
    return false;
  }

  if (todoArr.findIndex((obj) => obj.value === taskName) !== -1) {
    showAlert("Same task is already  present!");
    return false;
  }

  return true;
};

const addTask = () => {
  const task = todoInput.value.trim();
  todoInput.value = "";

  if (checkValidTask(task)) {
    todoArr.unshift({
      value: task,
      active: true,
      dateTime: new Date(),
    });
  }
  showList();
};

addBtn.addEventListener("click", () => {
  addTask();
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

const deleteTask = (index) => {
  todoArr.splice(index, 1);
  showList();
};

const completeTask = (index) => {
  todoArr[index].active = !todoArr[index].active;
  showList();
};

const updateTask = (index, count, event) => {
  const task = document.querySelectorAll(".task-name")[count];
  const taskValue = task.textContent.trim();
  if (event.key === "Enter") {
    if (checkValidTask(taskValue)) {
      todoArr[index].value = taskValue;
      todoArr[index].dateTime = new Date();
    }
    task.setAttribute("contenteditable", "false");
    showList();
  }
};

const editTask = (count) => {
  const task = document.querySelectorAll(".task-name")[count];
  task.setAttribute("contenteditable", "true");
  task.style.outline = "1px solid blue";
};

const toggleActiveClass = (targetBtn) => {
  filterBtns.forEach((filterBtn) => {
    filterBtn.classList.remove("active");
  });
  targetBtn.classList.add("active");
  showList();
};

allBtn.addEventListener("click", () => {
  toggleActiveClass(allBtn);
});

activeBtn.addEventListener("click", () => {
  toggleActiveClass(activeBtn);
});

completeBtn.addEventListener("click", () => {
  toggleActiveClass(completeBtn);
});

clearBtn.addEventListener("click", () => {
  todoArr = todoArr.filter((obj) => obj.active === true);
  toggleActiveClass(clearBtn);
});

showList();