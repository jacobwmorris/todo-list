import df from "./DomFuncs"
import { format, formatISO } from "date-fns";
import defaultUserPic from "./images/profile_placeholder.png";

class TodoDisplay {
  projectBar = document.getElementById("project-bar");
  projectList = document.getElementById("project-list");
  todoList = document.getElementById("todo-list");
  editor = document.getElementById("editor");

  update(data) {
    this.updateProjectBar(data);
    this.updateProjectList(data);
    this.updateTodoList(data);
    this.updateEditor(data);
  }

  updateProjectBar(data) {
    df.clearChildren(this.projectBar);
    const project = df.makeElement("h1", data.selectedProject === null ? "(No project selected)" : data.selectedProject.name);
    this.projectBar.appendChild(project);

    if (data.user !== null) {
      const icon = df.makeElement("div", "(profile pic)", "user-icon");
      const name = df.makeElement("div", data.user.username, "user-name");
      const signout = df.makeElement("button", "Sign out", "regular-button");
      icon.style.backgroundImage = data.user.photoURL
        ? `url(${this.addSizeToGoogleProfilePic(data.user.photoURL)})`
        : `url(${defaultUserPic})`;
      signout.addEventListener("click", data.handleSignOut);
      this.projectBar.appendChild(icon);
      this.projectBar.appendChild(name);
      this.projectBar.appendChild(signout);
    }
    else {
      const signin = df.makeElement("button", "Sign in", "regular-button");
      signin.addEventListener("click", data.handleSignIn);
      this.projectBar.appendChild(signin);
    }
  }

  addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
  }

  updateProjectList(data) {
    df.clearChildren(this.projectList);

    data.projectList.forEach((proj) => {
      const li = df.makeElement("li", "", "project");
      const removeButton = df.makeElement("button", "X", "red-button");
      const expandButton = df.makeElement("button", proj, "project-expand");
      removeButton.addEventListener("click", data.makeRemoveProjectHandler(proj));
      expandButton.addEventListener("click", data.makeSelectProjectHandler(proj));
      li.appendChild(removeButton);
      li.appendChild(expandButton);
      this.projectList.appendChild(li);
    });
  }

  updateTodoList(data) {
    df.clearChildren(this.todoList);

    if (data.selectedProject === null) {
      return;
    }

    data.selectedProject.todoList.forEach((todo) => {
      const li = df.makeElement("li", "", "todo");
      const removeButton = df.makeElement("button", "X", "red-button");
      const titleDesc = this.makeTodoTitleDesc(todo.title, todo.desc);
      const dueDate = this.makeTodoDueDate(todo.due);
      const priority = df.makeElement("div", todo.priority, "todo-priority");
      const checked = df.makeElement("input", "", "todo-done");
      const expandButton = df.makeElement("button", ">>", "todo-expand");
      li.setAttribute("data-priority", todo.priority);
      checked.setAttribute("type", "checkbox");
      removeButton.addEventListener("click", data.makeDeleteTodoHandler(todo));
      expandButton.addEventListener("click", data.makeStartEditTodoHandler(todo));
      checked.addEventListener("change", data.makeToggleCheckHandler(todo));
      checked.checked = todo.checked;
      li.appendChild(removeButton);
      li.appendChild(titleDesc);
      li.appendChild(dueDate);
      li.appendChild(priority);
      li.appendChild(checked);
      li.appendChild(expandButton);
      this.todoList.appendChild(li);
    });
  }

  makeTodoTitleDesc(title, desc) {
    const div = df.makeElement("div", "", "todo-titledesc");
    const titleElement = df.makeElement("h2", title);
    const descElement = df.makeElement("p", desc);
    div.appendChild(titleElement);
    div.appendChild(descElement);
    return div;
  }

  makeTodoDueDate(date) {
    return df.makeElement("div", format(date, "dd-MM-yyyy"), "todo-date");
  }

  updateEditor(data) {
    const todoSelected = data.selectedTodo !== null;
    this.editor.toggleAttribute("hidden", !todoSelected);

    if (!todoSelected) {
      return;
    }

    const title = document.getElementById("addform-title");
    const due = document.getElementById("addform-date");
    const priorityButtons = {
      L: document.getElementById("addform-lowp"),
      M: document.getElementById("addform-medp"),
      H: document.getElementById("addform-hip")
    };
    const desc = document.getElementById("addform-desc");
    //const checked = document.getElementById("addform-checked");
    //Put selected todo info into the form controls.
    title.value = data.selectedTodo.title;
    due.value = formatISO(data.selectedTodo.due, {representation: "date"});
    priorityButtons[data.selectedTodo.priority].checked = true;
    desc.value = data.selectedTodo.desc;
    //checked.checked = data.selectedTodo.checked;

    this.makeEditorButtons(data);
  }

  makeEditorButtons(data) {
    const container = document.getElementById("editor-buttons");
    const mode = data.selectedTodo.id ? "Edit" : "Add";
    df.clearChildren(container);
    
    const addButton = df.makeElement("button", mode);
    const cancelButton = df.makeElement("button", "Cancel");
    const label = df.makeElement("label", "Complete:")
    const checkbox = df.makeElement("input");
    if (mode === "Add") {
      addButton.addEventListener("click", data.handleAddTodo);
    }
    else if (mode === "Edit") {
      addButton.addEventListener("click", data.handleEditTodo);
      checkbox.addEventListener("change", data.makeToggleCheckHandler(data.selectedTodo));
    }
    cancelButton.addEventListener("click", data.handleCancelEdit);
    addButton.setAttribute("type", "submit");
    cancelButton.setAttribute("type", "button");
    label.setAttribute("for", "addform-checked");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "checked");
    checkbox.setAttribute("id", "addform-checked");
    checkbox.checked = data.selectedTodo.checked;
    
    container.appendChild(addButton);
    container.appendChild(cancelButton);
    container.appendChild(label);
    container.appendChild(checkbox);
  }
}

export default TodoDisplay;
