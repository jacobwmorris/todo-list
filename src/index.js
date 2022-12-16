import "./style.css";
import {parseISO} from "date-fns";
import {TodoItem, Project, ProjectList} from "./todos.js";
import {DisplayProjectList, DisplayTodoList} from "./display.js";
import TodoStorage from "./todostorage.js";
import TodoEditor from "./editor.js";

(function() {
    //Create project list and hook it up to display
    const projects = ProjectList();
    projects.registerObserver(DisplayProjectList);

    //Create todo list display to attatch to project objects
    function newProjectWithDisplay(name) {
        const newProj = Project(name);
        newProj.registerObserver(DisplayTodoList);
        projects.add(newProj);
    }

    //Look for project data
    //If none found, create default project
    TodoStorage.registerProjects(projects);
    if (!TodoStorage.loadProjects()) {
        //console.log("no data found, making default");
        newProjectWithDisplay("Default");
        projects.expand(projects.get(0));
        TodoStorage.storeProjects();
    }

    //Add form callbacks
    const projectFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.proj-form").classList.toggle("no-display");
    };

    const todoFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.todo-form").classList.toggle("no-display");
    }

    const clearCallback = function(event) {
        TodoStorage.clearStorage();
        TodoEditor.unexpand();
        projects.unexpand();
        projects.reset();
    };

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
        TodoStorage.storeProjects();
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
            const newTodo = TodoItem(titleIn.value, descIn.value, date, priority, false, projects.getExpanded());
            projects.getExpanded().add(newTodo);
        };
        
        titleIn.value = "";
        dateIn.value = "";
        descIn.value = "";
        radioButtons[1].checked = true;
        document.querySelector(".form-wrapper.todo-form").classList.add("no-display");
        TodoStorage.storeProjects();
        event.preventDefault();
    };

    document.getElementById("project-form-button").addEventListener("click", projectFormShowCallback);
    document.getElementById("todo-form-button").addEventListener("click", todoFormShowCallback);
    document.getElementById("clear-button").addEventListener("click", clearCallback);
    document.getElementById("add-project-button").addEventListener("click", addProjectCallback);
    document.getElementById("add-todo-button").addEventListener("click", addTodoCallback);
})();
