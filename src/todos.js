import {format} from "date-fns";

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

    const extractData = function() {
        const dataObj = {
            title: this.title,
            desc: this.description,
            due: format(this.dueDate, "yyyy-MM-dd"),
            prior: this.priority,
            check: this.checked
        };
        return dataObj;
    };

    return Object.assign(Object.create(proto),
        {title, description, dueDate, priority, checked, updateProperty, updateAll, removeSelf, extractData});
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

    /* const updateItem = function(id, item) {
        todos[id] = item;
    }; */

    const get = function(id) {
        return todos[id];
    };

    const todoCount = function() {
        return todos.length;
    };

    const extractData = function() {
        const dataObj = {
            name: name,
            todos: []
        };

        for (const t of todos) {
            dataObj.todos.push(t.extractData());
        }

        return dataObj;
    };

    return Object.assign(Object.create(proto),
        {name, expandedTodo, add, remove, show, /* updateItem, */ get, todoCount, extractData});
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

    const extractData = function() {
        const dataObj = {
            projs: []
        };

        for (const p of projects) {
            dataObj.projs.push(p.extractData());
        }

        return dataObj;
    };

    const reset = function() {
        projects.splice(0, projects.length);
        expandedProj = null;
        proto.notify(this);
    }

    return Object.assign(Object.create(proto),
        {add, remove, expand, unexpand, getExpanded, get, projCount, extractData, reset});
};

export {TodoItem, Project, ProjectList};
