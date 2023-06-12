import TodoApp from "./TodoApp"
import TodoDisplay from "./TodoDisplay";

const todoApp = new TodoApp()
todoApp.registerDisplay(new TodoDisplay());

//Add extra callbacks not handled by TodoDisplay
document.getElementById("new-proj-button").addEventListener("click", todoApp.handleStartNewProject);
document.getElementById("projform").addEventListener("submit", todoApp.handleAddProject);
document.getElementById("new-todo-button").addEventListener("click", todoApp.handleStartNewTodo);