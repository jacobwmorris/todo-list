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
  getDocs,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import {Project, Todo, todoConverter} from "./Project";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class TodoApp {
  selectedProject = null;
  selectedTodo = null;
  projectList = [];
  unsubFromProjects = null;
  
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

  handleAddProject = async (event) => {
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

    await this.selectOrAddProject(projName);
    
    document.getElementById("projform-container").toggleAttribute("hidden", true);
    this.updateDisplay();
  }

  async selectOrAddProject(projName) {
    const selectResult = await this.selectProject(projName);

    if (selectResult === "select project failed") {
      return selectResult;
    }
    if (selectResult === "no such project") {
      const addResult = await this.addProject(projName);
      return addResult
    }

    return selectResult; //Existing project selected, don't do anything else
  }

  async addProject(projName) {
    try {
      const projRef = doc(db, this.user.uid, projName);
      await setDoc(projRef, {});
    }
    catch (error) {
      console.error("Error adding project: " + error.message);
      return "add project failed";
    }

    return "success";
  }

  async selectProject(projName, useTestUser) {
    try {
      const projRef = doc(db, useTestUser ? "testuser" : this.user.uid, projName);
      const projSnap = await getDoc(projRef);
      if (!projSnap.exists()) {
        return "no such project";
      }

      const todoList = await this.getProjectTodos(useTestUser ? "testuser" : this.user.uid, projName);
      this.selectedProject = new Project(projName, todoList);
      this.selectedTodo = null;
    }
    catch (error) {
      console.error("Error selecting project: " + error.message);
      return "select project failed";
    }

    return "success";
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
        this.setupProjectListListener();
        this.updateDisplay();
      }
      else {
        this.user = null;
        this.unsubFromProjects();
        this.unsubFromProjects = null;
        this.updateDisplay();
      }
    })
  }

  setupProjectListListener() {
    const projectsRef = collection(db, this.user.uid);
    
    this.unsubFromProjects = onSnapshot(projectsRef, (docs) => {
      const newProjectList = [];
      docs.forEach((projDoc) => newProjectList.push(projDoc.id));
      this.projectList = newProjectList;
      console.log(this.projectList);
      this.updateDisplay();
    },
    (error) => {
      console.error("Project list listener failed: " + error.message);
    });
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
