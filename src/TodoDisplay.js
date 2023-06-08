import df from "./DomFuncs"
import defaultUserPic from "./images/profile_placeholder.png";

class TodoDisplay {
  projectBar = document.getElementById("project-bar");
  projectList = document.getElementById("project-list");
  todoList = document.getElementById("todo-list");

  update(data) {
    this.updateProjectBar(data);
    this.updateProjectList(data);
    this.updateTodoList(data);
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

  /* <ul id="todo-list">
    <li class="todo" data-priority="L">
      <button class="red-button">X</button>
      <div class="todo-titledesc">
        <h2>Do thing</h2>
        <p>stuff that will need to be done to complete the thing in question.</p>
      </div>
      <div class="todo-date">12-31-2022</div>
      <div class="todo-priority">L</div>
      <input class="todo-done" type="checkbox">
      <button class="todo-expand">>></button>
    </li>
  </ul> */
}

export default TodoDisplay;
