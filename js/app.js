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

    function createObject() {
        id = 1;
        tasks.push(
            {
                id: id++,
                title: taskNameField.value,
                date: dateField.value,
                priority: priority.value,
                description: descriptionField.value,
                done: false
            }
        );
    }

    // function createNewTask() {
    //     var newTask = document.createElement("li");
    //     var
    //
    // }


    function clearInput() {
        taskNameField.value = "";
        descriptionField.value = "";
        priority.value = priorityOptions[0].value;
    }


    hideForm();
    addButton.innerText = addButton.dataset.title;

    addButton.addEventListener("click", function () {
        form.hidden = !form.hidden;
        if (!form.hidden) {
            this.innerText = "add";
        } else {
            if (validate()) {
                hideForm();
                createObject();
                addButton.innerText = addButton.dataset.title;
            } else {
                showForm();
            }
        }
        clearInput();
    });
});