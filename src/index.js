//import {format} from "date-fns";
import "./style.css";
import {TodoItem, Project, ProjectList} from "./todos.js";
import {DisplayProjectList} from "./display.js";

/* let d = new Date(2000, 0, 1);
console.log(format(d, "MM/dd/yyyy")); */

(function() {
    //Set up displayers
    const displayProjectList = DisplayProjectList();
    
    //Create project list and hook it up to display
    const projects = ProjectList();
    projects.registerObserver(displayProjectList);

    //Create a default project
    projects.add(Project("Default"));

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

    document.getElementById("project-form-button").addEventListener("click", projectFormShowCallback);
    document.getElementById("add-project-button").addEventListener("click", addProjectCallback);
})();
