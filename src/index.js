import "./style.css";
import {parseISO} from "date-fns";
import {TodoItem, Project, ProjectList} from "./todos.js";
import {DisplayProjectList, DisplayTodoList, DisplayTodo} from "./display.js";

(function() {
    //Create project list and hook it up to display
    const projects = ProjectList();
    const displayProjectList = DisplayProjectList();
    projects.registerObserver(displayProjectList);

    //Create todo list display to attatch to project objects
    const displayTodoList = DisplayTodoList();
    function newProjectWithDisplay(name) {
        const newProj = Project(name);
        newProj.registerObserver(displayTodoList);
        projects.add(newProj);
    }
    newProjectWithDisplay("Default");
    projects.expand(projects.get(0));

    function newTodoWithDisplay(title, description, dueDate, priority) {
        const newTodo = TodoItem(title, description, dueDate, priority, false, projects.getExpanded());
        const displayTodo = DisplayTodo();
    }

    //Create a default project, and some default todos to test
    /* defaultProj.add(TodoItem("Test 1", "eiojckzlxnvapezmkcvpoiewalkaknmvklzxciovnrjanlkxcve", new Date(2000, 0, 1), "L", false, defaultProj));
    defaultProj.add(TodoItem("Test 2", "fiuocmizliumcoqkkjziscjoqc,jnvhruiozkjxhgiopamcjkzoiiii", new Date(2, 1, 2000), "M", false, defaultProj));
    defaultProj.add(TodoItem("Test 3", "acjmbioqoiejilkxio", new Date(3, 2, 2000), "H", false, defaultProj));
    defaultProj.add(TodoItem("Test 4", "lzicuhjkiqumcnjvkjbuyaoiq", new Date(4, 3, 2000), "L", true, defaultProj)); */

    //Add form callbacks
    const projectFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.proj-form").classList.toggle("no-display");
    };

    const todoFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.todo-form").classList.toggle("no-display");
    }

    const addProjectCallback = function(event) {
        const nameInput = document.getElementById("f-proj-name");
    
        if (!nameInput.value) {
            window.alert("Error: The project must have a name.");
            event.preventDefault();
            return;
        }

        newProjectWithDisplay(nameInput.value);
        nameInput.value = "";
        document.querySelector(".form-wrapper.proj-form").classList.add("no-display");
        event.preventDefault();
    };

    const addTodoCallback = function(event) {
        const titleIn = document.getElementById("f-title");
        const dateIn = document.getElementById("f-date");
        const descIn = document.getElementById("f-desc");
        const radioButtons = document.querySelectorAll('.f-pri-cell input[type="radio"]');

        let date = parseISO(dateIn.value);
        if (date.toString() === "Invalid Date") {
            date = Date.now();
        }

        let priority = "L";
        for (const b of radioButtons) {
            if (b.checked) {
                priority = b.value;
                break;
            }
        }

        if (projects.getExpanded()) {
            const newTodo = TodoItem(titleIn.value, descIn.value, date, priority, false, projects.getExpanded()); //check expanded project
            console.log(newTodo);
            projects.getExpanded().add(newTodo);
        };
        
        titleIn.value = "";
        dateIn.value = "";
        descIn.value = "";
        radioButtons[1].checked = true;
        document.querySelector(".form-wrapper.todo-form").classList.add("no-display");
        event.preventDefault();
    };

    document.getElementById("project-form-button").addEventListener("click", projectFormShowCallback);
    document.getElementById("todo-form-button").addEventListener("click", todoFormShowCallback);
    document.getElementById("add-project-button").addEventListener("click", addProjectCallback);
    document.getElementById("add-todo-button").addEventListener("click", addTodoCallback);
})();
