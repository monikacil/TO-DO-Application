

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
    var filterOptions = document.querySelector("#select2");
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
            var alertInfo = document.querySelector("p.alertInfo");
            alertInfo.innerText = "Please input task name";
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
                done: false,
                removed: false
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
        for (var i = 0; i < tasks.length; i++) {
            //CHECK VALUE OF filterOptions AND TASK STATE THEN DECIDE WHETHER TO SHOW IT OR NOT
            if (filterOptions.value === "all" ||
                (filterOptions.value === "todo" && tasks[i].done === false) ||
                (filterOptions.value === "done" && tasks[i].done === true)) {
                var newLi = create("li", "ui-state-default");
                var newLabel = create("label", "");
                var newCheckbox = create("input", "checkbox");
                newCheckbox.setAttribute("type", "checkbox");
                if (tasks[i].done)
                    newCheckbox.checked = "checked";
                var deleteBtnSmall = create("button", "btn mark deleteBtnSmall");
                deleteBtnSmall.innerText = "delete";
                if (tasks[i].removed)
                    deleteBtnSmall.removed = true;
                var todoInfoBox = create("div", "todoInfo");
                var descriptionBox = create("p", "", tasks[i].description);
                var priorityValueName = create("p", "valueName", "priority ");
                var dateValueName = create("p", "valueName", "date ");
                var priorityValue = create("span", "priorityValue", tasks[i].priority);
                var date = tasks[i].date;
                var dateValue = create("span", "dateValue", date.toString().replace(/\-/g, "."));
                var hrElement = create("hr");

                var listTodos = document.getElementById("listTodos");
                listTodos.appendChild(hrElement);
                listTodos.appendChild(newLi);
                newLi.appendChild(newLabel);
                newLabel.appendChild(newCheckbox);
                newLabel.appendChild(deleteBtnSmall);
                var titleText = document.createTextNode(tasks[i].title);
                newLi.appendChild(titleText);
                newLi.appendChild(todoInfoBox);
                todoInfoBox.appendChild(descriptionBox);
                todoInfoBox.appendChild(priorityValueName);
                priorityValueName.appendChild(priorityValue);
                todoInfoBox.appendChild(dateValueName);
                dateValueName.appendChild(dateValue);

                const j = i;
                newCheckbox.addEventListener("change", function () {
                    tasks[j].done = this.checked;
                });

                deleteBtnSmall.addEventListener("click", function() {
                    tasks.splice(j, 1);
                    showTask();
                });
            }
        }
    }

    //REMOVE ALL DONE TASKS
    var deleteAllBtn = document.querySelector("#deleteButton");
    deleteAllBtn.addEventListener("click", function() {

        for (var i = 0; i < tasks.length;) {
            if (tasks[i].done === true) {
                tasks.splice(i, 1);
            } else {
                i++;
            }
        }
        showTask();

    });

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

    //E V E N T S
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
                var alertInfo = document.querySelector("p.alertInfo");
                alertInfo.innerText = " ";
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

    filterOptions.addEventListener("change", function(){
        showTask();
    });
    //CHANGE COLORS
    var changeStyle = document.getElementById("change-style");
    var optionsChangeStyle = document.getElementById("options-change-style");
    console.log(changeStyle);
    console.log(optionsChangeStyle);
    // changeStyle.addEventListener("click", function() {
    //
    //
    // })



















});
