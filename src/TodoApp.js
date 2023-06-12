import firebaseConfig from "./firebase-config";
import {parseISO} from "date-fns";
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
  addDoc,
  setDoc,
  deleteDoc,
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
  unsubFromTodos = null;
  
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
    console.log("Display updated");
    this.display.update(this);
  }

  //Adding & editing project functions
  handleStartNewProject = (event) => {
    document.getElementById("projform-container").toggleAttribute("hidden");
  }

  handleAddProject = async (event) => {
    event.preventDefault();
    if (this.user === null) {
      return; //User not logged in
    }
    const projName = event.target.elements.projname.value;
    if (projName.length <= 0) {
      return; //Project has no name
    }

    await this.selectOrAddProject(projName);
    
    document.getElementById("projform-container").toggleAttribute("hidden", true);
  }

  makeRemoveProjectHandler = (projName) => {
    return (async (event) => {
      if (this.user === null) {
        return;
      }

      await this.removeProject(projName);
    })
  }

  makeSelectProjectHandler = (projName) => {
    return (async (event) => {
      if (this.user === null) {
        return;
      }

      await this.selectProject(projName);
    })
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
      await this.selectProject(projName);
    }
    catch (error) {
      console.error("Error adding project: " + error.message);
      return "add project failed";
    }

    return "success";
  }

  async removeProject(projName) {
    try {
      const projRef = doc(db, this.user.uid, projName);
      this.selectedProject = null;
      await deleteDoc(projRef); //TODO: deleting a document doesn't delete its subcollections
    }
    catch (error) {
      console.error("Error removing project: " + error.message);
      return "remove project failed";
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

      this.selectedProject = new Project(projName, []);
      this.selectedTodo = null;
      this.setupTodoListener(projName);
    }
    catch (error) {
      console.error("Error selecting project: " + error.message);
      return "select project failed";
    }

    return "success";
  }

  setupProjectListListener() {
    const projectsRef = collection(db, this.user.uid);
    
    this.unsubFromProjects = onSnapshot(projectsRef, (docs) => {
      const newProjectList = [];
      docs.forEach((projDoc) => newProjectList.push(projDoc.id));
      this.projectList = newProjectList;
      this.updateDisplay();
    },
    (error) => {
      console.error("Project list listener failed: " + error.message);
    });
  }

  //Adding/editing todo functions
  handleStartNewTodo = (event) => {
    if (this.user === null || this.selectedProject === null) {
      return;
    }

    this.selectedTodo = new Todo("", "", new Date(), "M", false);
    this.updateDisplay();
  }

  handleCancelEdit = (event) => {
    this.selectedTodo = null;
    this.updateDisplay();
  }

  handleAddTodo = async (event) => {
    event.preventDefault();
    if (this.user === null) {
      return;
    }

    const form = event.target.form.elements;
    const title = form.title.value;
    const desc = form.description.value;
    const due = parseISO(form.date.value);
    const priority = form.priority.value;
    const checked = form.checked ? true : false;

    this.selectedTodo = null;
    await this.addTodo(new Todo(title, desc, due, priority, checked));
  }

  async addTodo(todo) {
    if (this.selectedProject === null) {
      return "no selected project";
    }
    //Add a new doc to the current project collection
    const projRef = collection(db, this.user.uid, this.selectedProject.name, "todolist").withConverter(todoConverter);

    try {
      await addDoc(projRef, todo);
      return "success";
    }
    catch (error) {
      console.error("Problem adding todo: " + error.message);
      return "add todo failed";
    }
  }

  setupTodoListener(project) {
    //Tear down the previous listener if there was one
    if (this.unsubFromTodos !== null) {
      this.unsubFromTodos();
      this.unsubFromTodos = null;
    }

    //Make sure there is a selected project
    if (this.selectedProject === null) {
      return;
    }

    //Get the todos for the given project
    const todosRef = collection(db, this.user.uid, project, "todolist").withConverter(todoConverter);
    this.unsubFromTodos = onSnapshot(todosRef, (docs) => {
      const newList = [];
      docs.forEach((todoDoc) => {
        const todoObj = todoDoc.data();
        todoObj.id = todoDoc.id;
        newList.push(todoObj);
      });
      //Set that todo list to the selected projects list
      this.selectedProject.todoList = newList;
      //Update display
      this.updateDisplay();
    },
    (error) => {
      console.error("Todo list listener failed: " + error.message);
    });
  }
  
  //Auth functions
  registerAuthState() {
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        this.user = user;
        this.setupProjectListListener();
      }
      else {
        this.user = null;
        this.unsubFromProjects();
        this.unsubFromProjects = null;
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
