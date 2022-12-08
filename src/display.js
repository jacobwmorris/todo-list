const DisplayProjectList = function() {
    const projectList = document.getElementById("project-list");
    /* const projectTitle = document.getElementById("project-title");
    const todoList = document.getElementById("todo-list");
    const expanded = document.getElementById("expanded"); */

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

    const makeProjectListItem = function(name, projNum) {
        const item = makeElement("li", "", "project");
        const remove = makeElement("button", "X", "project-remove");
        remove.setAttribute("data-projnum", projNum);
        const expand = makeElement("button", name, "project-expand");
        //Add event listeners here
        item.appendChild(remove);
        item.appendChild(expand);
        return item;
    };

    const update = function(projects) {
        console.log("Updated");
        const list = document.createElement("ul");
        for (const project of projects) {
            list.appendChild(makeProjectListItem(project.name));
        }
        clearChildren(projectList);
        projectList.appendChild(list);
    };

    return {update};
};

export {DisplayProjectList};
