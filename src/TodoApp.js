import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import defaultUserPic from "./images/profile_placeholder.png";

class TodoApp {
  selectedProject = null;
  
  userLoggedIn = false;
  username = null;
  profilePic = defaultUserPic;
  
  display = null;

  constructor() {
    this.registerAuthState();
  }
  
  registerDisplay(display) {
    this.display = display;
    this.display.update(this);
  }
  
  updateDisplay() {
    this.display.update(this);
  }
  
  registerAuthState() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.userLoggedIn = true;
        this.username = user.displayName;
        this.profilePic = user.photoURL;
        this.updateDisplay();
      }
      else {
        this.userLoggedIn = false;
        this.username = null;
        this.profilePic = null;
        this.updateDisplay();
      }
    })
  }
  
  handleSignIn = async (event) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }
  
  handleSignOut = (event) => {
    signOut(getAuth());
  }
}

export default TodoApp;
