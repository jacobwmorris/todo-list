import df from "./DomFuncs"
import defaultUserPic from "./images/profile_placeholder.png";

class TodoDisplay {
  projectBar = document.getElementById("project-bar");

  update(data) {
    this.updateProjectBar(data);
  }

  updateProjectBar(data) {
    df.clearChildren(this.projectBar);
    const project = df.makeElement("h1", data.selectedProject === null ? "(No project selected)" : data.selectedProject);
    this.projectBar.appendChild(project);

    if (data.user !== null) {
      const icon = df.makeElement("div", "(profile pic)", "user-icon");
      const name = df.makeElement("div", data.user.username);
      const signout = df.makeElement("button", "Sign out");
      icon.style.backgroundImage = data.user.profilePic
        ? `url(${addSizeToGoogleProfilePic(data.user.profilePic)})`
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
}

export default TodoDisplay;
