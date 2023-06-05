import firebaseConfig from "./firebase-config";
import {initializeApp} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc
} from "firebase/firestore";
import defaultUserPic from "./images/profile_placeholder.png";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class TodoApp {
  selectedProject = null;
  
  userLoggedIn = false;
  username = null;
  profilePic = null;
  
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

  //Adding & editing project functions
  handleStartNewProject = (event) => {
    document.getElementById("projform-container").toggleAttribute("hidden");
  }

  handleAddProject = (event) => {

  }
  
  //Auth functions
  registerAuthState() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.userLoggedIn = true;
        this.username = user.displayName;
        this.profilePic = user.photoURL || defaultUserPic;
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
