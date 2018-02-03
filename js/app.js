

document.addEventListener('DOMContentLoaded', function () {

    //LOCAL STORAGE
    var myStorage = window.localStorage;

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
        myStorage.setItem("tasksList", JSON.stringify(tasks));
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
                var deleteBtnSmall = create("button", `btn mark deleteBtnSmall new-wave-${classIndexButtons%3}`);
                deleteBtnSmall.innerText = "delete";
                if (tasks[i].removed)
                    deleteBtnSmall.removed = true;
                var hrElement = create("hr", `new-bckg-${classIndexButtons%3}`);
                var listTodos = document.getElementById("listTodos");
                listTodos.appendChild(hrElement);
                var todoInfoBox = create("div", "todoInfo");
                var descriptionBox = create("p", "", tasks[i].description);
                todoInfoBox.appendChild(descriptionBox);
                if(tasks[i].priority !== "priority") {
                    var priorityValue = create("span", "priorityValue", tasks[i].priority);
                    var priorityValueName = create("p", `valueName new-color-${(classIndexButtons)%3}`, "priority ",);
                    todoInfoBox.appendChild(priorityValueName);
                    priorityValueName.appendChild(priorityValue);
                }
                var date = tasks[i].date;
                if(tasks[i].date.length > 0 ) {
                    var dateValueName = create("p", "valueName", "date ");
                    var dateValue = create("span", "dateValue", date.toString().replace(/\-/g, "."));
                    todoInfoBox.appendChild(dateValueName);
                    dateValueName.appendChild(dateValue);
                }


                listTodos.appendChild(newLi);
                newLi.appendChild(newLabel);
                newLabel.appendChild(newCheckbox);
                newLabel.appendChild(deleteBtnSmall);
                var titleText = document.createTextNode(tasks[i].title);
                newLi.appendChild(titleText);
                newLi.appendChild(todoInfoBox);


                const j = i;
                newCheckbox.addEventListener("change", function () {
                    tasks[j].done = this.checked;
                    myStorage.setItem("tasksList", JSON.stringify(tasks));
                });

                deleteBtnSmall.addEventListener("click", function() {
                    tasks.splice(j, 1);
                    myStorage.setItem("tasksList", JSON.stringify(tasks));
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
        myStorage.setItem("tasksList", JSON.stringify(tasks));
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
        myStorage.setItem("tasksList", JSON.stringify(tasks));
        myStorage.setItem("sortingStatus", JSON.stringify(event.target.value));
        showTask();
    });

    filterOptions.addEventListener("change", function(){
        myStorage.setItem("tasksList", JSON.stringify(tasks));
        showTask();
    });


    //CHANGE COLORS - show options
    var changeStyle = document.getElementById("change-style");
    var optionsChangeStyle = document.querySelectorAll(".options-change-style");

    optionsChangeStyle[0].hidden = true;
    optionsChangeStyle[1].hidden = true;

    changeStyle.addEventListener("click", function() {
        for (var i = 0; i < optionsChangeStyle.length; i++) {
            optionsChangeStyle[i].hidden = !optionsChangeStyle[i].hidden
        }
    });

    //CHANGE COLORS - changing background
    var prevBackground = document.querySelector(".color-background .fa-angle-left");
    var nextBackground = document.querySelector(".color-background .fa-angle-right");
    var body = document.querySelector("body");
    var classIndexBackground=0;


    function changeBackgroundColor(classIndex){
        body.className = `newBackground-${classIndex%4}`;
    }

    nextBackground.addEventListener("click", function() {
        classIndexBackground++;
        changeBackgroundColor(classIndexBackground);
        myStorage.setItem("backgroundColor", JSON.stringify(classIndexBackground));
    });
    prevBackground.addEventListener("click", function() {
        classIndexBackground--;
        if(classIndexBackground < 0){
            classIndexBackground = 3;
        }
        changeBackgroundColor(classIndexBackground);
        myStorage.setItem("backgroundColor", JSON.stringify(classIndexBackground));
    });

    //CHANGE COLORS - changing buttons
    //animation
    var prevColorButtons = document.querySelector(".color-buttons .fa-angle-left");
    var nextColorButtons = document.querySelector(".color-buttons .fa-angle-right");
    var colorButtons = document.querySelectorAll(".btn.mark");
    var classIndexButtons = 0;

    for (var i = 0; i < colorButtons.length; i++) {
      colorButtons[i].classList.add("new-wave-0");
    }
    //font color
    var h1 = document.querySelector("h1");
    var hr = document.querySelectorAll("hr");
    var todolist = document.querySelector(".todolist");
    var sortType = document.querySelectorAll(".sortType");
    var valueName = document.querySelectorAll(".valueName");
    var fas = document.querySelectorAll(".fas");


    //font color & animation - next

    function changeButtonsColor(classIndex){
        // body.className = `newBackground-${classIndex%4}`;
        for (var i = 0; i < colorButtons.length; i++) {
          colorButtons[i].classList.remove(`new-wave-${(classIndexButtons-1)%3}`);
          colorButtons[i].classList.add(`new-wave-${classIndexButtons%3}`);
        }
        for (var i = 0; i < hr.length; i++) {
          hr[i].classList.remove(`new-bckg-${(classIndexButtons-1)%3}`);
          hr[i].classList.add(`new-bckg-${(classIndexButtons)%3}`);
        }
        for (var i = 0; i < valueName.length; i++) {
          valueName[i].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
          valueName[i].classList.add(`new-color-${(classIndexButtons)%3}`);
        }
        for (var i = 0; i < fas.length; i++) {
          fas[i].classList.remove(`new-border-color-${(classIndexButtons-1)%3}`);
          fas[i].classList.add(`new-border-color-${classIndexButtons%3}`);
        }
        h1.classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        h1.classList.add(`new-color-${(classIndexButtons)%3}`);
        changeStyle.classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        changeStyle.classList.add(`new-color-${(classIndexButtons)%3}`);
        optionsChangeStyle[0].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        optionsChangeStyle[0].classList.add(`new-color-${(classIndexButtons)%3}`);
        optionsChangeStyle[1].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        optionsChangeStyle[1].classList.add(`new-color-${(classIndexButtons)%3}`);
        sortType[0].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        sortType[0].classList.add(`new-color-${(classIndexButtons)%3}`);
        sortType[1].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        sortType[1].classList.add(`new-color-${(classIndexButtons)%3}`);
        todolist.classList.remove(`new-main-border-${(classIndexButtons-1)%3}`);
        todolist.classList.add(`new-main-border-${(classIndexButtons)%3}`);
    }

    // function changeButtonsColor(classIndex){
      nextColorButtons.addEventListener("click", function() {
        colorButtons = document.querySelectorAll(".btn.mark");
        hr = document.querySelectorAll("hr");
        valueName = document.querySelectorAll(".valueName");
        classIndexButtons++;
        for (var i = 0; i < colorButtons.length; i++) {
          colorButtons[i].classList.remove(`new-wave-${(classIndexButtons-1)%3}`);
          colorButtons[i].classList.add(`new-wave-${classIndexButtons%3}`);
        }
        for (var i = 0; i < hr.length; i++) {
          hr[i].classList.remove(`new-bckg-${(classIndexButtons-1)%3}`);
          hr[i].classList.add(`new-bckg-${(classIndexButtons)%3}`);
        }
        for (var i = 0; i < valueName.length; i++) {
          valueName[i].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
          valueName[i].classList.add(`new-color-${(classIndexButtons)%3}`);
        }
        for (var i = 0; i < fas.length; i++) {
          fas[i].classList.remove(`new-border-color-${(classIndexButtons-1)%3}`);
          fas[i].classList.add(`new-border-color-${classIndexButtons%3}`);
        }
        h1.classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        h1.classList.add(`new-color-${(classIndexButtons)%3}`);
        changeStyle.classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        changeStyle.classList.add(`new-color-${(classIndexButtons)%3}`);
        optionsChangeStyle[0].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        optionsChangeStyle[0].classList.add(`new-color-${(classIndexButtons)%3}`);
        optionsChangeStyle[1].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        optionsChangeStyle[1].classList.add(`new-color-${(classIndexButtons)%3}`);
        sortType[0].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        sortType[0].classList.add(`new-color-${(classIndexButtons)%3}`);
        sortType[1].classList.remove(`new-color-${(classIndexButtons-1)%3}`);
        sortType[1].classList.add(`new-color-${(classIndexButtons)%3}`);
        todolist.classList.remove(`new-main-border-${(classIndexButtons-1)%3}`);
        todolist.classList.add(`new-main-border-${(classIndexButtons)%3}`);
        changeButtonsColor(classIndexButtons);
        myStorage.setItem("buttonsColor", JSON.stringify(classIndexButtons));
        });

        prevColorButtons.addEventListener("click", function() {
          colorButtons = document.querySelectorAll(".btn.mark");
          hr = document.querySelectorAll("hr");
          valueName = document.querySelectorAll(".valueName");
          classIndexButtons--;
          if(classIndexButtons < 0){
            classIndexButtons = 2;
          }
          for (var i = 0; i < hr.length; i++) {
            hr[i].classList.remove(`new-bckg-${(classIndexButtons+1)%3}`);
            hr[i].classList.add(`new-bckg-${(classIndexButtons)%3}`);
          }
          for (var i = 0; i < colorButtons.length; i++) {
            colorButtons[i].classList.remove(`new-wave-${(classIndexButtons+1)%3}`);
            colorButtons[i].classList.add(`new-wave-${classIndexButtons%3}`);
          }
          for (var i = 0; i < valueName.length; i++) {
            valueName[i].classList.remove(`new-color-${(classIndexButtons+1)%3}`);
            valueName[i].classList.add(`new-color-${(classIndexButtons)%3}`);
          }
          for (var i = 0; i < fas.length; i++) {
            fas[i].classList.remove(`new-border-color-${(classIndexButtons+1)%3}`);
            fas[i].classList.add(`new-border-color-${classIndexButtons%3}`);
          }
          h1.classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          h1.classList.add(`new-color-${(classIndexButtons)%3}`);
          changeStyle.classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          changeStyle.classList.add(`new-color-${(classIndexButtons)%3}`);
          optionsChangeStyle[0].classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          optionsChangeStyle[0].classList.add(`new-color-${(classIndexButtons)%3}`);
          optionsChangeStyle[1].classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          optionsChangeStyle[1].classList.add(`new-color-${(classIndexButtons)%3}`);
          sortType[0].classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          sortType[0].classList.add(`new-color-${(classIndexButtons)%3}`);
          sortType[1].classList.remove(`new-color-${(classIndexButtons+1)%3}`);
          sortType[1].classList.add(`new-color-${(classIndexButtons)%3}`);
          todolist.classList.remove(`new-main-border-${(classIndexButtons+1)%3}`);
          todolist.classList.add(`new-main-border-${(classIndexButtons)%3}`);
          changeButtonsColor(classIndexButtons);
          myStorage.setItem("buttonsColor", JSON.stringify(classIndexButtons));
          });

    // GET FROM LOCAL STORAGE AND SHOW
    var getTasks = myStorage.getItem("tasksList");
    if (getTasks !== null){
        tasks = JSON.parse(getTasks);
        showTask();
    }

    var getSortingStatus = myStorage.getItem("sortingStatus");
    if(getSortingStatus !== null){
        sortTypeOptions.value = JSON.parse(getSortingStatus);
    }

    var getBackgroundColor = myStorage.getItem("backgroundColor");
    if(getBackgroundColor !== null){
        classIndexBackground = JSON.parse(getBackgroundColor);
        changeBackgroundColor(classIndexBackground);
    } else {
        changeBackgroundColor(0);
    }

    var getButtonsColor = myStorage.getItem("buttonsColor");
    if(getButtonsColor !== null){
        classIndexButtons = JSON.parse(getButtonsColor);
        changeButtonsColor(classIndexButtons);
    } else {
        changeButtonsColor(0);
    }

});
