import {parseISO} from "date-fns";
import {TodoItem, Project} from "./todos.js";
import {DisplayTodoList} from "./display.js";

const TodoStorage = (function() {
    let projectList = null;

    const constructTodo = function(dataObj, proj) {
        const todo = TodoItem(dataObj.title, dataObj.desc, parseISO(dataObj.due), dataObj.prior, dataObj.check, proj);
        return todo;
    };

    const constructProj = function(dataObj) {
        const project = Project(dataObj.name);
        project.registerObserver(DisplayTodoList);

        for (const t of dataObj.todos) {
            project.add(constructTodo(t, project));
        }

        return project;
    };

    const constructProjList = function(dataObj) {
        projectList.reset();

        for (const p of dataObj.projs) {
            projectList.add(constructProj(p));
        }

        if (projectList.projCount() > 0) {
            projectList.expand(projectList.get(0));
        }
    };

    const registerProjects = function(projs) {
        projectList = projs;
    };

    const loadProjects = function() {
        const data = window.localStorage.getItem("projectList");
        if (!data || !projectList) {
            return false;
        }
        
        constructProjList(JSON.parse(data));
        return true;
    };

    const storeProjects = function() {
        if (!projectList)
            return;
        
        window.localStorage.clear();
        window.localStorage.setItem("projectList", JSON.stringify(projectList.extractData()));
        //console.log(window.localStorage.projectList);
    };

    const clearStorage = function() {
        window.localStorage.clear();
    };
    
    return {registerProjects, loadProjects, storeProjects, clearStorage};
})();

export default TodoStorage;
