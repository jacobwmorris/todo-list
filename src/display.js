import {format} from "date-fns";

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
            e.classList.add(clas);
        }

        return e;
    };

    return {clearChildren, makeElement};
})();

const DisplayProjectList = function() {
    const projectList = document.getElementById("project-list");
    //const projectTitle = document.getElementById("project-title");

    const makeProjectListItem = function(proj, projects) {
        const item = DomFuncs.makeElement("li", "", "project");
        const remove = DomFuncs.makeElement("button", "X", "red-button");
        const expand = DomFuncs.makeElement("button", proj.name, "project-expand");

        remove.addEventListener("click", function(event) {
            if (proj === projects.getExpanded()) {
                projects.unexpand();
            }
            projects.remove(proj);
        });
        expand.addEventListener("click", function(event) {
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

        //const titleText = (projectListData.getExpanded()) ? projectListData.getExpanded().name : "No project selected";
        projectList.appendChild(list);
        //projectTitle.appendChild(DomFuncs.makeElement("h1", titleText));
    };

    return {update};
};

const DisplayTodo = function() {
    const todo = DomFuncs.makeElement("div", "", "todo");

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
        });
        return button;
    };

    const makeCheckbox = function(todoData) {
        const box = DomFuncs.makeElement("input", "", "todo-done");
        box.setAttribute("type", "checkbox");
        box.checked = todoData.checked;

        box.addEventListener("change", function(event) {
            /* console.log(todoData);
            todoData.checked = !todoData.checked;
            update(todoData); */
            todoData.updateProperty("checked", !todoData.checked);
        });
        return box;
    }

    const update = function(todoData) {
        todo.setAttribute("data-priority", todoData.priority);

        if (todoData.checked)
            todo.classList.add("checked");
        else
            todo.classList.remove("checked");
        
        const removeButton = makeRemoveButton(todoData);
        //Separate this into a function
        const expandButton = DomFuncs.makeElement("button", ">>", "todo-expand");

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

const DisplayTodoList = function() {
    const todoList = document.getElementById("todo-list");
    const projTitle = document.getElementById("project-title");
    //const todoItems = [];

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
            //todoItems.push(itemDisplay);
        }
    };

    return {update};
};

/* <div class="todo pri-low">
const TodoItem = function(title, description, dueDate, priority, checked) {
    return {title, description, dueDate, priority, checked};
};
                    <button class="red-button">X</button>
                    <div class="todo-titledesc">
                        <h2>Do thing</h2>
                        <p>stuff that will need to be done to complete the thing in question.</p>
                    </div>
                    <p class="todo-date">12-31-2022</p>
                    <div class="todo-priority">L</div>
                    <input class="todo-done" type="checkbox">
                    <button class="todo-expand">>></button>
                </div> */

export {DisplayProjectList, DisplayTodo, DisplayTodoList};
