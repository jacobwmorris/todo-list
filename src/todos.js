const TodoItem = function(title, description, dueDate, priority) {
    return {title, description, dueDate, priority};
};

const Project = function(name) {
    const todos = [];
    let expandedTodo = null;

    const add = function(item) {
        todos.push(item);
    };

    const remove = function(id) {
        todos.splice(id, 1);
    };

    const update = function(id, item) {
        todos[id] = item;
    };

    const get = function(id) {
        return todos[id];
    };

    const todoCount = function() {
        return todos.length;
    };

    return {name, add, remove, update, get, todoCount};
};

const ProjectList = function() {
    //Observer handling functions
    const observers = [];

    const registerObserver = function(obs) {
        observers.push(obs);
    };

    const removeObserver = function(obs) {
        const i = observers.findIndex((o) => o === obs);
        if (i) {
            observers.splice(i, 1);
        }
    };

    const notify = function() {
        console.log("Notified");
        for (const o of observers) {
            console.log(o);
            o.update(projects);
        }
    };
    
    //Project list functions
    const projects = [];
    let expandedProj = null;

    const add = function(proj) {
        projects.push(proj);
        console.log("Project added");
        notify();
    };

    const remove = function(id) {
        projects.splice(id, 1);
        notify();
    };

    const get = function(id) {
        return projects[id];
    };

    const todoCount = function() {
        return projects.length;
    };

    return {registerObserver, removeObserver, notify, add, remove, get, todoCount};
};

export {TodoItem, Project, ProjectList};
