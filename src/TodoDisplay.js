import df from "./DomFuncs"
import defaultUserPic from "./images/profile_placeholder.png";

class TodoDisplay {
  projectBar = document.getElementById("project-bar");
  projectList = document.getElementById("project-list");

  update(data) {
    this.updateProjectBar(data);
    this.updateProjectList(data);
  }

  updateProjectBar(data) {
    df.clearChildren(this.projectBar);
    const project = df.makeElement("h1", data.selectedProject === null ? "(No project selected)" : data.selectedProject);
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
      li.appendChild(removeButton);
      li.appendChild(expandButton);
      this.projectList.appendChild(li);
    });
  }
}

export default TodoDisplay;
