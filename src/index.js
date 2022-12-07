//import {format} from "date-fns";
import "./style.css";
import {TodoItem, Project} from "./todos.js";

/* let d = new Date(2000, 0, 1);
console.log(format(d, "MM/dd/yyyy")); */

function listProjects(projList) {
    for (const proj of projList) {
        console.log(proj.name);
    }
}

(function() {
    const projects = [];

    projects.push(Project("Default"));

    const projectFormShowCallback = function(event) {
        document.querySelector(".form-wrapper.proj-form").classList.toggle("no-display");
    };

    const addProjectCallback = function(event) {
        const name = document.getElementById("f-proj-name").value;
    
        if (!name) {
            window.alert("Error: The project must have a name.");
            return;
        }

        projects.push(Project(name));
        document.querySelector(".form-wrapper.proj-form").classList.add("no-display");
        listProjects(projects);
        event.preventDefault();
    };

    document.getElementById("project-form-button").addEventListener("click", projectFormShowCallback);
    document.getElementById("add-project-button").addEventListener("click", addProjectCallback);
})();
