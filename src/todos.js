const Subject = function() {
    const observers = [];

    const registerObserver = function(obs) {
        observers.push(obs);
    };

    const removeObserver = function(obs) {
        const i = observers.findIndex(o => o === obs);
        if (i >= 0) {
            observers.splice(i, 1);
        }
    };

    const notify = function(object) {
        for (const o of observers) {
            o.update(object);
        }
    };

    return {registerObserver, removeObserver, notify};
};

const TodoItem = function(title, description, dueDate, priority, checked) {
    return {title, description, dueDate, priority, checked};
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
    const proto = Subject();
    
    //Project list functions
    const projects = [];
    let expandedProj = null;

    const add = function(proj) {
        projects.push(proj);
        proto.notify(this);
    };

    const remove = function(proj) {
        const i = projects.findIndex(p => p === proj);
        if (i >= 0) {
            projects.splice(i, 1);
        }
        proto.notify(this);
    };

    const get = function(id) {
        return projects[id];
    };

    const projCount = function() {
        return projects.length;
    };

    return Object.assign(Object.create(proto), {add, remove, get, projCount});
};

export {TodoItem, Project, ProjectList};
