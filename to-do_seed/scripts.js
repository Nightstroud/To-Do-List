class ToDoList {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem("LISTS"));
        if(!this.lists) {
            this.lists = [
                {list: "First List", tasks: new ToDoClass, num: 0},
                {list: "Second List", tasks: new ToDoClass, num: 1},
                {list: "Third List", tasks: new ToDoClass, num: 2}
            ];
        }
        else {
            for (let i = 0; i < this.lists.length; i++) {
                this.lists[i].tasks = new ToDoClass();
                this.lists[i].tasks.num = this.lists[i].num;
                this.lists[i].tasks.tasks = JSON.parse(localStorage.getItem("LISTS"))[i].tasks.tasks;
                localStorage.setItem('LISTS', JSON.stringify(this.lists));
            }
        }
        this.ListAmount = this.lists.length - 1;
        this.selectedList = this.lists[0];
        this.loadLists();
        this.addEventListeners();
    }

    loadLists() {
        let tasksHtml = this.lists.reduce((html, list, index) => html += this.generateTaskHtml(list, index), "");
        document.getElementById("navigationBar").innerHTML = tasksHtml;
        this.store()}

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

    store() {
        localStorage.setItem('LISTS', JSON.stringify(this.lists));
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
        document.getElementById('selList').innerHTML = 'No Selection';
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
        if (list === "") {
        } else {
            this.lists.push(newTask);
            toDoList.store();
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
        for (let v = 0; v < toDoList.lists.length; v++) {
            for (let i = 0; i < toDoList.lists[v].tasks.tasks.length; i++) {
                if (toDoList.lists[v].tasks.tasks[i].isComplete === true) {
                    toDoList.lists[v].tasks.deleteTask(null, i);
                }
            }
        }
        document.getElementById('selList').innerHTML = 'No Selection';
        this.checkCompleted();
    }

    checkCompleted() {
        for (let v = 0; v < toDoList.lists.length; v++) {
            for (let i = 0; i < toDoList.lists[v].tasks.tasks.length; i++) {
                if (toDoList.lists[v].tasks.tasks[i].isComplete === true) {
                    this.ClearCompleted();
                }
            }
        }
    }


}


class ToDoClass {
    constructor() {
        this.num = 0;
        this.tasks = [];
        this.addEventListeners();
    }

    loadTasks() {
        let tasksHtml = this.tasks.reduce((html, task, index) => html += this.generateTaskHtml(task, index), "");
        document.getElementById("taskList").innerHTML = tasksHtml;
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
        toDoList.store();
        this.loadTasks();
    }

    deleteTask (event, taskIndex) {
        if (event !== null) {
            event.preventDefault();
        }
        this.tasks.splice(taskIndex, 1);
        this.loadTasks();
        toDoList.store();
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
        if (task === "") {
        } else {
            toDoList.selectedList.tasks.tasks.push(newTask);
            toDoList.selectedList.tasks.loadTasks();
        }
        toDoList.store();
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

