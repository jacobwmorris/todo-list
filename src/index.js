import firebaseConfig from "./firebase-config";
import {initializeApp} from "firebase/app";

import TodoApp from "./TodoApp"
import TodoDisplay from "./TodoDisplay";

const todoAppInit = initializeApp(firebaseConfig);

const todoApp = new TodoApp()
todoApp.registerDisplay(new TodoDisplay());
