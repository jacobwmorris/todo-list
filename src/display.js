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

    const makeProjectListItem = function(proj, projects) {
        const item = makeElement("li", "", "project");
        const remove = makeElement("button", "X", "project-remove");
        const expand = makeElement("button", proj.name, "project-expand");

        remove.addEventListener("click", function(event) {
            projects.remove(proj);
        });

        item.appendChild(remove);
        item.appendChild(expand);
        return item;
    };

    const update = function(projects) {
        const list = document.createElement("ul");
        for (let i = 0; i < projects.projCount(); i++) {
            const proj = projects.get(i);
            list.appendChild(makeProjectListItem(proj, projects));
        }
        clearChildren(projectList);
        projectList.appendChild(list);
    };

    return {update};
};

export {DisplayProjectList};
