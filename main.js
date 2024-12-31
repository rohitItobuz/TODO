const storedArray = localStorage.getItem('array')
let todoArr = (storedArray) ? JSON.parse(storedArray) : [];

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const completeBtn = document.getElementById("complete");
const clearBtn = document.getElementById("clear");
const filterBtns = document.querySelectorAll(".filter-button");
const alert = document.querySelector(".alert");

const createList = (value, active, index) => {
    const newTask = document.createElement("div");
    const taskname = document.createElement("p");
    const taskBtnContainer = document.createElement("div");
    const checkBtn = document.createElement("button");
    const checkIcon = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("img");
    const editBtn = document.createElement("button");
    const editIcon = document.createElement("img");

    taskname.textContent = value;
    taskname.setAttribute("id",`task${index}`)
    taskname.setAttribute('class','task-name fs-5 mb-0 overflow-scroll');

    taskBtnContainer.appendChild(checkBtn);
    taskBtnContainer.appendChild(editBtn);
    taskBtnContainer.appendChild(deleteBtn);

    checkIcon.src = "images/checked.png";
    checkIcon.classList.add("task-icon");

    checkBtn.classList.add("border-0");
    checkBtn.classList.add("checkTask");
    checkBtn.setAttribute("onClick", `completeTask('${index}')`);
    checkBtn.appendChild(checkIcon);

    deleteIcon.src = "images/trash-bin.png";
    deleteIcon.classList.add("task-icon");

    deleteBtn.classList.add("border-0");
    deleteBtn.setAttribute("onClick", `deleteTask(${index})`);
    deleteBtn.appendChild(deleteIcon);

    editIcon.src = "images/edit.png";
    editIcon.classList.add("task-icon");

    editBtn.classList.add("border-0");
    editBtn.setAttribute("onClick", `editTask('${index}')`);
    editBtn.appendChild(editIcon);

    if (!active){
        taskname.classList.add("text-decoration-line-through");
        editBtn.setAttribute('disabled' ,'true');
        editBtn.style.cursor ='not-allowed';
    }

    newTask.append(taskname,taskBtnContainer);
    newTask.setAttribute('class',"task-container d-flex justify-content-between p-2 m-auto rounded-1 mb-2");

    todoList.appendChild(newTask);
};

const showList = () => {
    todoList.innerHTML = "";
    localStorage.setItem("array", JSON.stringify(todoArr));

    if (allBtn.classList.contains('active')) {
        todoArr.forEach(({ value, active }, index) => createList(value, active, index));
    }

    else if (completeBtn.classList.contains('active')) {
        todoArr.forEach(({ value, active }, index) => {
            if (!active)
                createList(value, active, index)
        });
    }

    else if (activeBtn.classList.contains('active')){
        todoArr.forEach(({ value, active }, index) => {
            if (active)
                createList(value, active, index)
        });
    }
}

const addTask = () => {
    const task = todoInput.value.trim();
    todoInput.value = "";
    if (task !== "") {
        if (todoArr.findIndex(({ value, active }) => value === task) === -1) {
            todoArr.unshift({
                'value': task,
                'active': true
            });
        }
        else {
            alert.style.display = 'block'

            setTimeout(() => {
                alert.style.display = 'none'
            }, 5000)
        }
        showList();
    }
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

const editTask = (index) => {
    const task = document.querySelector(`#task${index}`)
    task.setAttribute("contenteditable" , "true");
    task.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if(task.textContent!=="")
                todoArr[index].value = task.textContent;
            task.setAttribute("contenteditable" , "false")
        }
    });
};

const removeActiveClass = () => {
    filterBtns.forEach(filterBtn => {
        filterBtn.classList.remove('active');
    });
}

allBtn.addEventListener("click", () => {
    removeActiveClass();
    allBtn.classList.add('active');
    showList();
});

activeBtn.addEventListener("click", () => {
    removeActiveClass();
    activeBtn.classList.add('active');
    showList();
});

completeBtn.addEventListener("click", () => {
    removeActiveClass();
    completeBtn.classList.add('active');
    showList();
});

clearBtn.addEventListener("click", () => {
    todoArr = todoArr.filter(({ value, active }) => active === true);
    removeActiveClass();
    clearBtn.classList.add('active');
    showList();
});

showList();