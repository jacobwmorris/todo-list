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

const TodoItem = function(title, description, dueDate, priority, checked, list) {
    const proto = Subject();

    const updateProperty = function(name, val) {
        this[name] = val;
        proto.notify(this);
    };

    const updateAll = function(title, description, dueDate, priority, checked) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = checked;
        proto.notify(this);
    };

    const removeSelf = function() {
        if (list)
            list.remove(this);
    };

    return Object.assign(Object.create(proto), {title, description, dueDate, priority, checked, updateProperty, updateAll, removeSelf});
};

const Project = function(name) {
    const proto = Subject();

    const todos = [];
    let expandedTodo = null;

    const add = function(item) {
        todos.push(item);
        proto.notify(this);
    };

    const remove = function(todo) {
        const i = todos.findIndex(t => t === todo);
        if (i >= 0) {
            todos.splice(i, 1);
        }
        proto.notify(this);
    };

    const show = function(showNothing) {
        if (showNothing)
            proto.notify(null);
        else
            proto.notify(this);
    }

    const updateItem = function(id, item) {
        todos[id] = item;
    };

    const get = function(id) {
        return todos[id];
    };

    const todoCount = function() {
        return todos.length;
    };

    return Object.assign(Object.create(proto), {name, expandedTodo, add, remove, show, updateItem, get, todoCount});
};

const ProjectList = function() {
    const proto = Subject();
    
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

    const expand = function(proj) {
        expandedProj = proj;

        if (expandedProj) {
            expandedProj.show();
        }
    };

    const unexpand = function() {
        if (expandedProj) {
            expandedProj.show(true);
            expandedProj = null;
        }
    }

    const getExpanded = function() {
        return expandedProj;
    }

    const get = function(id) {
        return projects[id];
    };

    const projCount = function() {
        return projects.length;
    };

    return Object.assign(Object.create(proto), {add, remove, expand, unexpand, getExpanded, get, projCount});
};

export {TodoItem, Project, ProjectList};
