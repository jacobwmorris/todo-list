import {format} from "date-fns";
import TodoEditor from "./editor.js";
import TodoStorage from "./todostorage.js";

const DomFuncs = (function() {
    const clearChildren = function(element) {
        while (element.children.length) {
            element.removeChild(element.lastChild);
        }
    }

    const makeElement = function(type, text, clas) {
        const e = document.createElement(type);
        e.textContent = text;
        if (clas) {
            if (Array.isArray(clas)) {
                for (const c of clas) {
                    e.classList.add(c);
                }
            }
            else {
                e.classList.add(clas);
            }
        }

        return e;
    };

    return {clearChildren, makeElement};
})();

const DisplayTodo = function() {
    const todo = DomFuncs.makeElement("div", "", ["todo", "list-item"]);

    const makeTitleDesc = function(title, desc) {
        const titleDesc = DomFuncs.makeElement("div", "", "todo-titledesc");
        titleDesc.appendChild(DomFuncs.makeElement("h2", title));
        titleDesc.appendChild(DomFuncs.makeElement("p", desc));
        return titleDesc;
    };

    const makeRemoveButton = function(todoData) {
        const button = DomFuncs.makeElement("button", "X", "red-button");

        button.addEventListener("click", function(event) {
            todoData.removeSelf();

            if (todoData === TodoEditor.getEdited()) {
                TodoEditor.unexpand();
            }

            TodoStorage.storeProjects();
        });
        return button;
    };

    const makeCheckbox = function(todoData) {
        const box = DomFuncs.makeElement("input", "", "todo-done");
        box.setAttribute("type", "checkbox");
        box.checked = todoData.checked;

        box.addEventListener("change", function(event) {
            todoData.updateProperty("checked", !todoData.checked);
            TodoEditor.setChecked(todoData.checked);
            TodoStorage.storeProjects();
        });
        return box;
    }

    const makeExpandButton = function(todoData) {
        const button = DomFuncs.makeElement("button", ">>", "todo-expand");

        button.addEventListener("click", function(event) {
            TodoEditor.edit(todoData);
        });

        return button;
    };

    const update = function(todoData) {
        todo.setAttribute("data-priority", todoData.priority);

        if (todoData.checked)
            todo.classList.add("checked");
        else
            todo.classList.remove("checked");
        
        const removeButton = makeRemoveButton(todoData);
        const expandButton = makeExpandButton(todoData);

        DomFuncs.clearChildren(todo);
        todo.appendChild(removeButton);
        todo.appendChild(makeTitleDesc(todoData.title, todoData.description));
        todo.appendChild(DomFuncs.makeElement("p", format(todoData.dueDate, "MM-dd-yyyy"), "todo-date"));
        todo.appendChild(DomFuncs.makeElement("div", todoData.priority, "todo-priority"));
        todo.appendChild(makeCheckbox(todoData));
        todo.appendChild(expandButton);
    };

    const getElement = function() {return todo;};

    return {update, getElement};
};

const DisplayTodoList = (function() {
    const todoList = document.getElementById("todo-list");
    const projTitle = document.getElementById("project-title");

    const update = function(projectData) {
        //Project title
        DomFuncs.clearChildren(projTitle);
        const titleText = (projectData) ? projectData.name : "No project selected";
        projTitle.appendChild(DomFuncs.makeElement("h1", titleText));

        //List items
        DomFuncs.clearChildren(todoList);

        if (!projectData)
            return;

        for (let i = 0; i < projectData.todoCount(); i++) {
            const item = projectData.get(i);
            const itemDisplay = DisplayTodo();
            item.registerObserver(itemDisplay);
            itemDisplay.update(item);
            todoList.appendChild(itemDisplay.getElement());
        }
    };

    return {update};
})();

const DisplayProjectList = (function() {
    const projectList = document.getElementById("project-list");

    const makeProjectListItem = function(proj, projects) {
        const item = DomFuncs.makeElement("li", "", ["project", "list-item"]);
        const remove = DomFuncs.makeElement("button", "X", "red-button");
        const expand = DomFuncs.makeElement("button", proj.name, "project-expand");

        remove.addEventListener("click", function(event) {
            if (proj === projects.getExpanded()) {
                TodoEditor.unexpand();
                projects.unexpand();
            }
            projects.remove(proj);
            TodoStorage.storeProjects();
        });
        expand.addEventListener("click", function(event) {
            TodoEditor.unexpand();
            projects.expand(proj);
        });

        item.appendChild(remove);
        item.appendChild(expand);
        return item;
    };

    const update = function(projectListData) {
        DomFuncs.clearChildren(projectList);

        const list = document.createElement("ul");
        for (let i = 0; i < projectListData.projCount(); i++) {
            const proj = projectListData.get(i);
            list.appendChild(makeProjectListItem(proj, projectListData));
        }

        projectList.appendChild(list);
    };

    return {update};
})();

export {DisplayTodo, DisplayTodoList, DisplayProjectList};
