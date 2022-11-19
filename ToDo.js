let todosTable = document.getElementById("todos-table")
let addTodoForm = document.getElementById("create-todo-form")

document.addEventListener("DOMContentLoaded", GetAllToDos)
addTodoForm.addEventListener("submit", createNewAPITodo)

function GetAllToDos() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var todosArr = JSON.parse(this.responseText);
            console.log(todosArr);
            renderTodos(todosArr)
        }
    };

    xhttp.open("GET", "https://cse204.work/todos", true);
    xhttp.setRequestHeader("x-api-key", "398193-2d3316-05c01b-d2dd01-605963");
    xhttp.send();
}

function renderTodos(todosArr) {
    for (i = 0; i < todosArr.length; i++) {
        createAndRenderNewHTMLTodo(todosArr[i])
    }
}

function createNewAPITodo(event) {
    event.preventDefault();
    const todoText = document.getElementById("todo-content")
    const todoTextValue = todoText.value
    todoText.value = ""
    // Setting variable for form input (get from HTML form)
    var data = {
        text: todoTextValue
    }
    // Initalize AJAX Request
    var xhttp2 = new XMLHttpRequest();
    // Response handler
    xhttp2.onreadystatechange = function () {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            // parse JSON response
            var todoObj = JSON.parse(this.responseText);
            console.log(todoObj);
            createAndRenderNewHTMLTodo(todoObj);
        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    };
    xhttp2.open("POST", "https://cse204.work/todos", true);
    xhttp2.setRequestHeader("Content-type", "application/json");
    xhttp2.setRequestHeader("x-api-key", "398193-2d3316-05c01b-d2dd01-605963");
    xhttp2.send(JSON.stringify(data));
}

function createAndRenderNewHTMLTodo(todoObj) {
    const newTableRow = document.createElement("tr")
    const newTableRowCell = document.createElement("td")
    const newTodoDiv = document.createElement("div")
    const newTodoContent = document.createElement("span")
    const newTodoCheckbox = document.createElement("input")
    const newTodoDeleteButton = document.createElement("button")

    //Set newTodoContent Element
    newTodoContent.textContent = todoObj.text;
    newTodoContent.style.color = "red"
    newTodoContent.style.marginLeft = 0
    if (todoObj.completed) {
        newTodoContent.style.textDecoration = "line-through";
    }

    //Set newTodoCheckbox Element
    newTodoCheckbox.setAttribute("type", "checkbox")
    newTodoCheckbox.setAttribute("id", todoObj.id)
    newTodoCheckbox.checked = todoObj.completed
    newTodoCheckbox.style.marginLeft = 0
    newTodoCheckbox.style.marginRight = "10px"
    newTodoCheckbox.addEventListener("change", updateTodoAPI)

    //Set newTodoDeleteButton Element
    newTodoDeleteButton.setAttribute("type", "button")
    newTodoDeleteButton.setAttribute("id", todoObj.id)
    newTodoDeleteButton.innerHTML = "X"
    newTodoDeleteButton.style.marginRight = 0
    newTodoDeleteButton.style.backgroundColor = "none"
    newTodoDeleteButton.style.border = "none"
    newTodoDeleteButton.addEventListener("click", deleteTodo)

    //Set newTodoDiv + tableRowCell Elements
    newTodoDiv.appendChild(newTodoCheckbox)
    newTodoDiv.appendChild(newTodoContent)
    newTodoDiv.appendChild(newTodoDeleteButton)
    newTodoDiv.setAttribute("class", "todo-item")
    newTableRowCell.appendChild(newTodoDiv)

    //Set newTableRow + todosTable Element
    newTableRow.setAttribute("id", todoObj.id)
    newTableRow.appendChild(newTableRowCell)
    todosTable.appendChild(newTableRow)
}

function updateTodoAPI(event) {
    var data = {
        completed: event.target.checked
    }
    // Initalize AJAX Request
    var xhttp3 = new XMLHttpRequest();
    // Response handler
    xhttp3.onreadystatechange = function () {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            // parse JSON response
            var response = JSON.parse(this.responseText);
            console.log(response);
            updateTodoHTML(event.target.parentElement.children[1], event.target.checked)
        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    }
    xhttp3.open("PUT", "https://cse204.work/todos/" + event.target.id, true);
    xhttp3.setRequestHeader("Content-type", "application/json");
    xhttp3.setRequestHeader("x-api-key", "398193-2d3316-05c01b-d2dd01-605963");
    xhttp3.send(JSON.stringify(data));
}

function updateTodoHTML(todoContent, isChecked) {
    if (isChecked) {
        todoContent.style.textDecoration = "line-through";
    }
    else {
        todoContent.style.textDecoration = "none";
    }

}


function deleteTodo(event) {
    deleteTodoFromAPI(event.target.id)
    deleteTodoFromHTML(event.target.id)
}

function deleteTodoFromAPI(todoID) {
    // Initalize AJAX Request
    var xhttp4 = new XMLHttpRequest();
    // Response handler
    xhttp4.onreadystatechange = function () {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            // parse JSON response
            console.log("succeed");
        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log("failed to delete" + this.responseText);
        }
    }
    xhttp4.open("DELETE", "https://cse204.work/todos/" + todoID, true);
    xhttp4.setRequestHeader("Content-type", "application/json");
    xhttp4.setRequestHeader("x-api-key", "398193-2d3316-05c01b-d2dd01-605963");
    xhttp4.send();
}

function deleteTodoFromHTML(todoID) {
    let todoTableRow = document.getElementById(todoID)
    todoTableRow.remove()
}


