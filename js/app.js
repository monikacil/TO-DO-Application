

document.addEventListener('DOMContentLoaded', function () {

    //T A S K 1 - validation and saving tasks
    var addButton = document.getElementById("addButton");

    var taskNameField = document.getElementById("taskName");
    var descriptionField = document.getElementById("description");
    var dateField = document.getElementById("date");
    var priorityOptions = document.querySelectorAll("select#priority option");
    var priority = document.getElementById("priority");
    var form = document.getElementById("formTodo");
    var sortTypeOptions = document.querySelector("#select1");
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

    function sortTasks(optionValue){
        if(optionValue === "priority"){
            sortByPriority();
        } else if(optionValue === "id"){
            sortById();
        } else if(optionValue === "deadline"){
            sortByDeadlineDate();
        }
    }

    function createNewTask() {
        var taskObj = createTaskObject();
        tasks.push(taskObj);
        sortTasks(sortTypeOptions.value);
    }

    //1 REMOVE ALL TASKS
    //2 RECREATE NEW HTML STRUCTURE BASED ON tasks ARRAY
    function showTask() {
        clearList();
        for(var i = 0; i < tasks.length; i++) {
            var newLi = create("li", "ui-state-default");
            var newLabel = create("label", "");
            var newCheckbox = create("input");
            newCheckbox.setAttribute("type", "checkbox");
            if (tasks[i].done)
                newCheckbox.checked = "checked";
            var todoInfoBox = create("div", "todoInfo");
            var descriptionBox = create("p", "", tasks[i].description);
            var priorityValueName = create("p", "valueName", "priority ");
            var dateValueName = create("p", "valueName", "date ");
            var priorityValue = create("span", "priorityValue", tasks[i].priority);
            var dateValue = create("span", "dateValue", tasks[i].date);
            var hrElement = create("hr");

            var listTodos = document.getElementById("listTodos");
            listTodos.appendChild(hrElement);
            listTodos.appendChild(newLi);
            newLi.appendChild(newLabel);
            newLabel.appendChild(newCheckbox);
            var titleText = document.createTextNode(tasks[i].title);
            newLi.appendChild(titleText);
            newLi.appendChild(todoInfoBox);
            todoInfoBox.appendChild(descriptionBox);
            todoInfoBox.appendChild(priorityValueName);
            priorityValueName.appendChild(priorityValue);
            todoInfoBox.appendChild(dateValueName);
            dateValueName.appendChild(dateValue);

            const j = i;
            newCheckbox.addEventListener("change", function() {
                tasks[j].done = this.checked;
                console.log(this.checked);
            });
            console.log(tasks);
        }
    }

    //REMOVE ALL TASKS FROM HTML
    function clearList() {
        var listTodos = document.getElementById("listTodos");
        var liElements = document.querySelectorAll("#listTodos li");
        var hrElements = document.querySelectorAll("#listTodos hr");
        for(var i = 0; i < liElements.length; i++) {
            listTodos.removeChild(liElements[i]);
        }
        for(var j = 0; j < hrElements.length; j++){
            listTodos.removeChild(hrElements[j]);
        }
    }

    function clearInput() {
        taskNameField.value = "";
        descriptionField.value = "";
        priority.value = priorityOptions[0].value;
    }

    //SORTING FUNCTIONS
    function sortByPriority() {
        tasks.sort(function(a, b){
            return (a.priority - b.priority);
        })
    }

    function sortById() {
        tasks.sort(function(a, b){
            return (a.id - b.id);
        })
    }

    function sortByDeadlineDate(){
        tasks.sort(function (a, b){
            var firstDate = new Date(a.date);
            var secondDate = new Date(b.date);
            return firstDate - secondDate;
        })
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
                showTask();
                hideForm();
                addButton.innerText = addButton.dataset.title;
            } else {
                showForm();
            }
        }
        clearInput();
    });

    sortTypeOptions.addEventListener("change", function(event){
        sortTasks(event.target.value);
        showTask();
    });
});