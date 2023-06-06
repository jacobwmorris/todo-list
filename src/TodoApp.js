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
  doc,
  collection,
  getDoc,
  getDocs
} from "firebase/firestore";
import {Project, Todo, todoConverter} from "./Project";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class TodoApp {
  selectedProject = null;
  selectedTodo = null;
  
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
    if (this.user === null) {
      //User not logged in
      return;
    }
    const projName = event.target.elements.projname.value;
    if (projName.length <= 0) {
      //Project has no name
      return;
    }

    const projDoc = doc(db, user.uid, projName);
    
    document.getElementById("projform-container").toggleAttribute("hidden", true);
  }

  async selectProject(projName, useTestUser) {
    if (this.user === null && !useTestUser) {
      return false; //User not logged in
    }
    
    try {
      const projRef = doc(db, useTestUser ? "testuser" : this.user.uid, projName);
      const projSnap = await getDoc(projRef);
      if (!projSnap.exists()) {
        return false; //The given project doesn't exist
      }

      const todoList = await this.getProjectTodos(useTestUser ? "testuser" : this.user.uid, projName);
      this.selectedProject = new Project(projName, todoList);
      this.selectedTodo = null;
      this.updateDisplay();
    }
    catch (error) {
      console.error("Error selecting project: " + error.message);
      console.log(error);
      return false //Promise rejected
    }

    return true;
  }

  async getProjectTodos(user, projName) {
    const todoSnap = await getDocs(collection(db, user, projName, "todolist").withConverter(todoConverter));
    const todoList = [];
    todoSnap.forEach((todoDoc) => {
      todoList.push(todoDoc.data());
    });
    return todoList;
  }
  
  //Auth functions
  registerAuthState() {
    onAuthStateChanged(getAuth(app), (user) => {
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
    try {
      await signInWithPopup(getAuth(app), provider);
    }
    catch (error) {
      console.error("Error signing in: " + error.message);
    }
  }
  
  handleSignOut = (event) => {
    signOut(getAuth(app));
  }
}

export default TodoApp;
