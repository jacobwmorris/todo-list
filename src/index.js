import TodoApp from "./TodoApp"
import TodoDisplay from "./TodoDisplay";

const todoApp = new TodoApp()
todoApp.registerDisplay(new TodoDisplay());

//Add extra callbacks not handled by TodoDisplay
document.getElementById("new-proj-button").addEventListener("click", todoApp.handleStartNewProject);
document.getElementById("projform").addEventListener("submit", todoApp.handleAddProject);

todoApp.selectProject("testproject", true).then(() => console.log(todoApp.selectedProject));
