const newTask = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const editTaskButton = document.getElementById('edit-task');
const title = document.getElementById('inputTitle');
const text = document.getElementById('inputText');
const currentTasks = document.getElementById('currentTasks');
const completeField = document.getElementById('completedTasks');
const priorityFields = document.getElementsByClassName('form-check-input');
const ascSortButton = document.getElementById('sort-from-new');
const descSortButton = document.getElementById('sort-from-old');
const saveButton = document.getElementById('save');
const switcher = document.getElementById('customSwitch1');

let toDo = [];
let completed = [];
let index;
let toDoCount = 0;
let completedToDoCount = 0;


function setTaskTime() {
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let date = new Date().toLocaleDateString();
    return `${time} ${date}`;
}

function selectPriority() {
    for (let i = 0; i < priorityFields.length; i++) {
        if (priorityFields[i].checked) {
            return priorityFields[i].value;
        }
    }
}


function createTaskField(el, area) {
    let li = document.createElement('li');
    li.classList.add("list-group-item", "d-flex", "w-100", "mb-2");
    area.appendChild(li);

    colorTask(li, el.priority);

    let wrapper = document.createElement('div');
    wrapper.classList.add("w-100", "mb-2");
    li.appendChild(wrapper);
    let container = document.createElement('div');
    container.classList.add("d-flex", "w-100", "justify-content-between");
    wrapper.appendChild(container);
    let title = document.createElement('h5');
    title.classList.add("mb-1");
    title.innerText = el.title;
    container.appendChild(title);
    let priorityDate = document.createElement('div');
    container.appendChild(priorityDate);
    let priority = document.createElement('small');
    priority.classList.add("mr-2");
    priority.innerText = el.priority;
    priorityDate.appendChild(priority);
    let date = document.createElement('small');
    date.innerText = el.time;
    priorityDate.appendChild(date);
    let text = document.createElement('p');
    text.classList.add("mb-1", "w-100");
    text.innerText = el.text;;
    wrapper.appendChild(text);
    let deleteButton = document.createElement('button');
    deleteButton.classList.add("btn", "btn-danger", "w-100");
    deleteButton.innerText = "Delete";

    if (area === currentTasks) {
        let dropdown = document.createElement('div');
        dropdown.classList.add("dropdown", "m-2", "dropleft");
        li.appendChild(dropdown);
        let dropdownButton = document.createElement('button');
        dropdownButton.classList.add("btn", "btn-secondary", "h-100");
        dropdownButton.type = "button";
        dropdownButton.id = "dropdownMenuItem1";
        dropdownButton.setAttribute("data-toggle", "dropdown");
        dropdownButton.setAttribute("aria-haspopup", "true");
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdown.appendChild(dropdownButton);
        let i = document.createElement('i');
        i.classList.add("fas", "fa-ellipsis-v");
        i.setAttribute("aria-hidden", "true");
        dropdownButton.appendChild(i);
        let dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add("dropdown-menu", "p-2", "flex-column");
        dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuItem1");
        dropdownMenu.setAttribute("x-placement", "left-start");
        dropdownMenu.style = "position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-162px, 0px, 0px);"
        dropdown.appendChild(dropdownMenu);
        let completeButton = document.createElement('button');
        completeButton.classList.add("btn", "btn-success", "w-100");
        completeButton.type = "button";
        completeButton.onclick = moveToComplete;
        completeButton.innerText = "Complete";
        dropdownMenu.appendChild(completeButton);
        let editButton = document.createElement('button');
        editButton.classList.add("btn", "btn-info", "w-100", "my-2");
        editButton.type = "button";
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#exampleModal");
        editButton.onclick = editTaskData;
        editButton.innerText = "Edit";
        dropdownMenu.appendChild(editButton);
        dropdownMenu.appendChild(deleteButton);
        deleteButton.onclick = deleteTaskData;
    } else {
        li.appendChild(deleteButton);
        deleteButton.style = "width: 100px !important; margin-left: 20px";
        deleteButton.onclick = deleteTaskData;
    }

}

function colorTask(li, priority) {
    switch (priority) {
        case 'Low priority':
            li.style.backgroundColor = '#ffc916';
            break;
        case 'Medium priority':
            li.style.backgroundColor = '#a3cd3b';
            break;
        case 'High priority':
            li.style.backgroundColor = '#ff4943';
            break;
    }
}

function createNewTask() {
    editTaskButton.classList.add('hide');
    addTaskButton.classList.add('show');
}


function addTask() {
    const taskCount = currentTasks.getElementsByTagName("li").length
    let task = {
        title: '',
        text: '',
        priority: '',
        time: '',
        date: ''

    }
    task.title = title.value;
    task.text = text.value;
    task.priority = selectPriority() + ' priority';
    task.time = setTaskTime();
    task.date = new Date();
    toDo.push(task);
    createTaskField(task, currentTasks);
    toDoCount++
    document.getElementById('toDo-count').innerHTML = ' (' + toDoCount + ')';
    saveData();
}

function moveToComplete() {
    let toDoIndex = toDo[index];
    let currentTask = this.closest('.list-group-item');
    index = Array.from(currentTask.parentNode.children).indexOf(currentTask);
    currentTasks.removeChild(currentTask);
    completed.push(toDoIndex);
    createTaskField(toDoIndex, completeField)
    toDo.splice(index, 1);
    toDoCount--
    document.getElementById('toDo-count').innerHTML = ' (' + toDoCount + ')';
    completedToDoCount++
    document.getElementById('completed-count').innerHTML = ' (' + completedToDoCount + ')';
    saveData();
}

function editTaskData() {
    addTaskButton.style.display = "none";
    editTaskButton.style.display = "inline";
    let currentTask = this.closest('.list-group-item');
    index = Array.from(currentTask.parentNode.children).indexOf(currentTask);
    let toDoIndex = toDo[index];
    title.value = toDoIndex.title;
    text.value = toDoIndex.text;
    switch (toDoIndex.priority) {
        case 'Low priority':
            document.getElementById('Low').checked = "true";
            break;
        case 'Medium priority':
            document.getElementById('Medium').checked = "true";
            break;
        case 'High priority':
            document.getElementById('High').checked = "true";
            break;
        default:
            document.getElementById('Low').checked = "true";
            break;
    }

}

function saveEditChanges() {
    let li = document.querySelectorAll('.list-group-item')[index];
    let task = {
        title: '',
        text: '',
        priority: '',
        time: ''
    }
    task.title = title.value;
    task.text = text.value;
    task.priority = selectPriority() + ' priority';
    task.time = setTaskTime();
    toDo.splice(index, 1, task);
    let newElement = currentTasks.children[index];
    let newTitle = newElement.getElementsByTagName("h5")[0];
    let newText = newElement.getElementsByTagName("p")[0];
    let newPriority = newElement.getElementsByTagName("small")[0];
    let newTime = newElement.getElementsByTagName("small")[1];
    newTitle.innerHTML = task.title;
    newText.innerHTML = task.text;
    newPriority.innerHTML = selectPriority() + ' priority';
    newTime.innerHTML = setTaskTime();
    colorTask(li, selectPriority() + ' priority');
    editTaskButton.setAttribute("data-dismiss", "modal");
    saveData();
}

function deleteTaskData() {
    let currentTask = this.closest('.list-group-item');
    index = Array.from(currentTask.parentNode.children).indexOf(currentTask);
    let type = this.closest('.list-group-item').parentNode.id;
    if (type === "currentTasks") {
        toDo.splice(index, 1);
        currentTasks.removeChild(currentTask);
        toDoCount--
        document.getElementById('toDo-count').innerHTML = ' (' + toDoCount + ')';
    } else {
        completed.splice(index, 1);
        completeField.removeChild(currentTask);
        completedToDoCount--
        document.getElementById('completed-count').innerHTML = ' (' + completedToDoCount + ')';
    }
    saveData();
}

function sortFromNew() {
    toDo.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });
    currentTasks.innerHTML = "";
    toDo.forEach(function(el) {
        return createTaskField(el, currentTasks);
    })
    saveData();
}

function sortFromOld() {
    toDo.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    currentTasks.innerHTML = "";
    toDo.forEach(function(el) {
        return createTaskField(el, currentTasks);
    })
    saveData();
}

function changeTheme() {
    if (switcher.checked) {
        document.querySelector('.navbar').classList.remove('bg-light');
        document.querySelector('.modal-content').classList.add('white_theme');
        document.body.style.backgroundColor = '#0e1621';
        document.body.style.color = 'white';
        switcher.nextElementSibling.textContent = 'Dark Mode';
    } else {
        document.querySelector('.navbar').classList.add('bg-light');
        document.querySelector('.modal-content').classList.add('black_theme');
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        switcher.nextElementSibling.textContent = 'White Mode';
    }
}


newTask.addEventListener('click', createNewTask)
addTaskButton.addEventListener('click', addTask);
editTaskButton.addEventListener('click', saveEditChanges);
ascSortButton.addEventListener('click', sortFromNew);
descSortButton.addEventListener('click', sortFromOld);
switcher.addEventListener('click', changeTheme)


function saveData() {
    localStorage.setItem('toDo', JSON.stringify(toDo));
    localStorage.setItem('completedToDo', JSON.stringify(completed));
}


window.onload = function loadTasks() {
    let task = localStorage.getItem('toDo');
    if (task !== null) {
        toDo = JSON.parse(localStorage.getItem('toDo'));
        currentTasks.innerHTML = "";
        toDoCount = toDo.length;
        document.getElementById('toDo-count').innerText = ' (' + `${toDoCount}` + ')';
        toDo.forEach(function(el) {
            createTaskField(el, currentTasks);
        })
    }
    let taskComplited = localStorage.getItem('completedToDo');
    if (taskComplited !== null) {
        completed = JSON.parse(localStorage.getItem('completedToDo'));
        completeField.innerHTML = "";
        completedToDoCount = completed.length;
        document.getElementById('completed-count').innerText = ' (' + `${completedToDoCount}` + ')';
        completed.forEach(function(el) {
            createTaskField(el, completeField);
        })
    }
}