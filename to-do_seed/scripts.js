class ToDoList {
    constructor() {
        this.ListAmount = 0;
        // this.lists = JSON.parse(localStorage.getItem("LISTS"));
        if(!this.lists) {
            this.lists = [
                {list: "First List", tasks: new ToDoClass(), num: this.ListAmount++},

            ];
        }
        this.selectedList = this.lists[0];
        this.loadLists();
        this.addEventListeners();
    }

    loadLists() {
        let tasksHtml = this.lists.reduce((html, list, index) => html += this.generateTaskHtml(list, index), "");
        document.getElementById("navigationBar").innerHTML = tasksHtml;
        // localStorage.setItem('LISTS', JSON.stringify(this.lists));
        // localStorage.clear();
    }

    generateTaskHtml (list, index) {
        return `
           
                <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text"> 
                    <p class="editable" id="clickable" onclick="document.getElementById('selList').innerHTML = '${list.list}'; toDoList.selectedList = toDoList.lists[${this.findList(list.list)}]; toDoList.selectedList.tasks.loadTasks();">${list.list}</p>
                </div>
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
                    <a class="" href="/" onClick="toDoList.deleteList(event, ${index})">
                        <i id="deleteTask" data-id="${index}" class="delete-icon glyphicon glyphicon-trash"></i>
                    </a>
                </div>
            </div>
`;
    }

    findList (value) {
        let result;
        for(let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].list === value) {
                return result = i;
            }
        }
        return result;
    }

    deleteList (event, taskIndex) {
        event.preventDefault();
        this.lists.splice(taskIndex, 1);
        this.loadLists();
    }

    addListClick() {
        let target = document.getElementById("addList");
        this.addList(target.value, this.ListAmount++);
        target.value = "";
    }

    addList(list, num) {
        let newTask = {
            list, "tasks": new ToDoClass(), num, "selected": false
        };
        let parentDiv = document.getElementById("addList").parentElement;
        if (list === "") {
            parentDiv.classList.add('has-error');
        } else {
            parentDiv.classList.remove('has-error');
            this.lists.push(newTask);
            this.loadLists();
        }
    }

    addEventListeners() {
        document.getElementById("addList").addEventListener("keypress", event => {
            if(event.keyCode === 13) {
                this.addList (event.target.value, this.ListAmount++);
                event.target.value = "";
            }
        });
    }

    ClearCompleted() {
        let x = this.selectedList.tasks.tasks;
        for (let i = 0; i < x.length; i++) {
            if (x[i].isComplete === true) {
                this.selectedList.tasks.deleteTask(null, i);
            }
        }
        this.checkCompleted();
    }

    checkCompleted() {
        let x = this.selectedList.tasks.tasks;
        for (let i = 0; i < x.length; i++) {
            if (x[i].isComplete === true) {
                this.ClearCompleted();
            }
        }
    }


}


class ToDoClass {
    constructor() {
        // this.tasknum = toDoList.selectedList.num;
        // this.tasks = JSON.parse(localStorage.getItem(`TASKS${this.tasknum}`));
        if(!this.tasks) {
            this.tasks = [
                {task: "Incomplete Task", isComplete: false},
                {task: "Completed Task", isComplete: true}
            ];
        }

        this.loadTasks();
        this.addEventListeners();
    }

    loadTasks() {
        let tasksHtml = this.tasks.reduce((html, task, index) => html += this.generateTaskHtml(task, index), "");
        document.getElementById("taskList").innerHTML = tasksHtml;
        // localStorage.setItem(`TASKS${this.tasknum}`, JSON.stringify(this.tasks));
    }

    generateTaskHtml (task, index) {
        return `
        <li class="list-group-item checkbox">
            <div class="row">
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 checkbox">
                    <label>
                        <input id="toggleTaskStatus" type="checkbox" onchange="toDoList.selectedList.tasks.toggleTaskStatus(${index})" value="" class="" ${task.isComplete?'checked':''}>
                    </label>
                </div>
                <div class="editable col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text ${task.isComplete?'complete':''}"> 
                    ${task.task}
                </div>
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
                    <a class="" href="/" onClick="toDoList.selectedList.tasks.deleteTask(event, ${index})">
                        <i     id="deleteTask" data-id="${index}" class="delete-icon glyphicon     glyphicon-trash"></i>
                    </a>
                </div>
            </div>
        </li>
`;
    }

    toggleTaskStatus (index) {
        this.tasks[index].isComplete = !this.tasks[index].isComplete;
        this.loadTasks();
    }

    deleteTask (event, taskIndex) {
        if (event !== null) {
            event.preventDefault();
        }
        this.tasks.splice(taskIndex, 1);
        this.loadTasks();
    }

    addTaskClick() {
        let target = document.getElementById("addTask");
        this.addTask(target.value);
        target.value = "";
    }

    addTask(task) {
        let newTask = {
            task, isComplete: false,
        };
        let parentDiv = document.getElementById("addTask").parentElement;
        if (task === "") {
            parentDiv.classList.add('has-error');
        } else {
            parentDiv.classList.remove('has-error');
            toDoList.selectedList.tasks.tasks.push(newTask);
            toDoList.selectedList.tasks.loadTasks();
        }
    }

    addEventListeners() {
        document.getElementById("addTask").addEventListener("keypress", event => {
            if(event.keyCode === 13) {
                toDoList.selectedList.tasks.addTask (event.target.value);
                event.target.value = "";
            }
        });
    }
}

let toDoList;
window.addEventListener("load", () => {     // Run this on load.
    toDoList = new ToDoList();
});

