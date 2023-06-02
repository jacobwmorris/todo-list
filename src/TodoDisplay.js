import df from "./DomFuncs"

class TodoDisplay {
  projectBar = document.getElementById("project-bar");

  update(data) {
    this.updateProjectBar(data);
  }

  updateProjectBar(data) {
    df.clearChildren(this.projectBar);
    const project = df.makeElement("h1", data.selectedProject === null ? "(No project selected)" : data.selectedProject);
    this.projectBar.appendChild(project);

    if (data.userLoggedIn) {
      const icon = df.makeElement("div", "(profile pic)", "user-icon");
      const name = df.makeElement("div", data.username);
      const signout = df.makeElement("button", "Sign out");
      icon.style.backgroundImage = `url(${data.profilePic})`;
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
}

export default TodoDisplay;
