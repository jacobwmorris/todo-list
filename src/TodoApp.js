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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class TodoApp {
  selectedProject = null;
  
  user = null;
  
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
    event.preventDefault();
    const projName = event.target.elements.projname.value;
    
    document.getElementById("projform-container").toggleAttribute("hidden", true);
  }
  
  //Auth functions
  registerAuthState() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.user = user;
        this.updateDisplay();
      }
      else {
        this.user = null;
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
