import "./style.css";
import {TodoItem, Project, ProjectList} from "./todos.js";
import {DisplayProjectList, DisplayTodoList} from "./display.js";

(function() {
    //Set up displayers
    const displayProjectList = DisplayProjectList();
    const displayTodoList = DisplayTodoList();
    
    //Create project list and hook it up to display
    const projects = ProjectList();
    projects.registerObserver(displayProjectList);

    //Create a default project, and some default todos to test
    const defaultProj = Project("Default");
    defaultProj.add(TodoItem("Test 1", "eiojckzlxnvapezmkcvpoiewalkaknmvklzxciovnrjanlkxcve", new Date(1, 0, 2000), "L", false));
    defaultProj.add(TodoItem("Test 2", "fiuocmizliumcoqkkjziscjoqc,jnvhruiozkjxhgiopamcjkzoiiii", new Date(2, 1, 2000), "M", false));
    defaultProj.add(TodoItem("Test 3", "acjmbioqoiejilkxio", new Date(3, 2, 2000), "H", false));
    defaultProj.add(TodoItem("Test 4", "lzicuhjkiqumcnjvkjbuyaoiq", new Date(4, 3, 2000), "L", true));
    displayTodoList.update(defaultProj);
    projects.add(defaultProj);

    //Add form callbacks
    const projectFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.proj-form").classList.toggle("no-display");
    };

    const addProjectCallback = function(event) {
        const nameInput = document.getElementById("f-proj-name");
    
        if (!nameInput.value) {
            window.alert("Error: The project must have a name.");
            event.preventDefault();
            return;
        }

        projects.add(Project(nameInput.value));
        nameInput.value = "";
        document.querySelector(".form-wrapper.proj-form").classList.add("no-display");
        event.preventDefault();
    };

    const addTodoCallback = function(event) {
        const titleIn = document.getElementById("f-title");
        const dateIn = document.getElementById("f-date");
        const descIn = document.getElementById("f-desc");

        ///How to get data from radio buttons?
    };

    document.getElementById("project-form-button").addEventListener("click", projectFormShowCallback);
    document.getElementById("add-project-button").addEventListener("click", addProjectCallback);
})();
