import df from "./DomFuncs"
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
      const name = df.makeElement("div", data.user.username);
      const signout = df.makeElement("button", "Sign out");
      icon.style.backgroundImage = data.user.photoURL
        ? `url(${this.addSizeToGoogleProfilePic(data.user.photoURL)})`
        : `url(${defaultUserPic})`;
      signout.addEventListener("click", data.handleSignOut);
      this.projectBar.appendChild(icon);
      this.projectBar.appendChild(name);
      this.projectBar.appendChild(signout);
    }
    else {
      const signin = df.makeElement("button", "Sign in");
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
      const li = df.makeElement("li");
      const removeButton = df.makeElement("button", "X", "remove-button");
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
      const checked = df.makeElement("checkbox", "", "todo-done");
      const expandButton = df.makeElement("button", ">>", "todo-expand");
      li.setAttribute("data-priority", todo.priority);
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
    return df.makeElement("div", "(due date)", "todo-date");
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
    const checked = document.getElementById("addform-checked");
    //Put selected todo info into the form controls.
    title.value = data.selectedTodo.title;
    due.value = "2000-01-01";
    priorityButtons[data.selectedTodo.priority].checked = true;
    desc.value = data.selectedTodo.desc;
    checked.checked = data.selectedTodo.checked;

    this.makeEditorButtons(data);
  }

  makeEditorButtons(data) {
    const container = document.getElementById("editor-buttons");
    const mode = data.selectedTodo.id ? "Edit" : "Add";
    df.clearChildren(container);
    
    const addButton = df.makeElement("button", mode);
    const cancelButton = df.makeElement("button", "Cancel");
    if (mode === "Add") {
      addButton.addEventListener("click", data.handleAddTodo);
    }
    else if (mode === "Update") {
      addButton.addEventListener("click", (e) => console.log("Edited todo")/*placeholder*/);
    }
    cancelButton.addEventListener("click", data.handleCancelEdit);
    addButton.setAttribute("type", "submit");
    cancelButton.setAttribute("type", "button");
    
    container.appendChild(addButton);
    container.appendChild(cancelButton);
  }

  /* <div id="editor">
  <form action="#" id="addform">
    <label for="addform-title">Title:</label>
    <input type="text" name="title" id="addform-title">
    
    <label for="addform-date">Due Date:</label>
    <input type="date" name="date" id="addform-date">
    
    <fieldset>
      <legend>Priority</legend>
      <label for="addform-lowp"><input type="radio" name="priority" value="L" id="addform-lowp">Low</label>
      <label for="addform-medp"><input type="radio" name="priority" value="M" id="addform-medp" checked>Medium</label>
      <label for="addform-hip"><input type="radio" name="priority" value="H" id="addform-hip">High</label>
    </fieldset>

    <label for="addfrom-desc">Description:</label>
    <textarea name="description" id="addfrom-desc" cols="60" rows="8"></textarea>
    
    <label for="checked">Complete:</label>
    <input type="checkbox" name="checked">

    <div>
      <button type="submit">Add</button>
      <button type="button">Cancel</button>
    </div>
  </form>
</div> */
}

export default TodoDisplay;
