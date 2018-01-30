

document.addEventListener('DOMContentLoaded', function () {

    //T A S K 1 - validation and saving tasks
    var addButton = document.getElementById("addButton");

    var taskNameField = document.getElementById("taskName");
    var descriptionField = document.getElementById("description");
    var dateField = document.getElementById("date");
    var priorityOptions = document.querySelectorAll("select#priority option");
    var priority = document.getElementById("priority");
    var form = document.getElementById("formTodo");
    var tasks = [];
    var id = 1;


    //F U N C T I O N S
    function hideForm() {
        form.hidden = true;
    }

    function showForm() {
        form.hidden = false;
    }

    function validate() {
        if (taskNameField.value.length === 0) {
            alert("You have to add task name");
            return false
        }
        return true;
    }

    function createTaskObject() {
       return {
                id: id++,
                title: taskNameField.value,
                date: dateField.value,
                priority: priority.value,
                description: descriptionField.value,
                done: false
       }
    }

    function create(tag, className, content) {
        var element = document.createElement(tag);
        if(className) {
            element.className = className;
        }
        if(content) {
            element.innerHTML = content;
        }
        return element;
    }

    function createNewTask() {
        var taskObj = createTaskObject();

        var newLi = create("li", "ui-state-default");
        var newLabel = create("label", "");
        var newCheckbox = create("input");
        newCheckbox.setAttribute("type","checkbox");
        var todoInfoBox = create("div", "todoInfo");
        var descriptionBox = create("p", "", taskObj.description);
        var priorityValueName = create("p", "valueName", "priority ");
        var dateValueName = create("p", "valueName", "date ");
        var priorityValue = create("span", "priorityValue", taskObj.priority);
        var dateValue = create("span", "dateValue", taskObj.date);
        var hrElement = create("hr");

        var listTodos = document.getElementById("listTodos");
        listTodos.appendChild(hrElement);
        listTodos.appendChild(newLi);
        newLi.appendChild(newLabel);
        newLabel.appendChild(newCheckbox);
        var titleText = document.createTextNode(taskObj.title);
        newLi.appendChild(titleText);
        newLi.appendChild(todoInfoBox);
        todoInfoBox.appendChild(descriptionBox);
        todoInfoBox.appendChild(priorityValueName);
        priorityValueName.appendChild(priorityValue);
        todoInfoBox.appendChild(dateValueName);
        dateValueName.appendChild(dateValue);
    }

    function clearInput() {
        taskNameField.value = "";
        descriptionField.value = "";
        priority.value = priorityOptions[0].value;
    }

    //D E F A U L T
    hideForm();
    addButton.innerText = addButton.dataset.title;

    //E V E N T
    addButton.addEventListener("click", function () {
        form.hidden = !form.hidden;
        if (!form.hidden) {
            this.innerText = "add";
        } else {
            if (validate()) {
                createNewTask();
                hideForm();
                addButton.innerText = addButton.dataset.title;
            } else {
                showForm();
            }
        }
        clearInput();
    });
});