const TodoStorage = (function() {
    let projectList = null;

    const registerProjects = function(projs) {
        projectList = projs;
    };

    const loadProjects = function() {
        if (window.localStorage.length === 0 || !projectList)
            return;
        
        
    };

    const storeProjects = function() {
        window.localStorage.clear();
        window.localStorage.setItem("projectList", JSON.stringify(projectList.extractData()));
        console.log(window.localStorage);
    };
    
    return {registerProjects, loadProjects, storeProjects};
})();

export default TodoStorage;
