const TodoItem = function(title, description, dueDate, priority) {
    return {title, description, dueDate, priority};
};

const Project = function(name) {
    const todos = [];

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

export {TodoItem, Project};
