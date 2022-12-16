import {parseISO, format} from "date-fns";
import TodoStorage from "./todostorage";

const TodoEditor = (function() {
    const editArea = document.getElementById("edit-form");
    const titleIn = document.getElementById("edit-title");
    const descriptionIn = document.getElementById("edit-desc");
    const dateIn = document.getElementById("edit-date");
    const priorityButtons = document.querySelectorAll('#edit-form input[type="radio"]');
    const checkedIn = document.getElementById("edit-done");
    let editedTodo = null;

    const unexpand = function() {
        editedTodo = null;
        editArea.classList.add("no-display");
    };

    function unexpandCallback(event) {
        unexpand();
    }

    function updateCallback(event) {
        if (!editedTodo) {
            event.preventDefault();
            return;
        }
        
        const title = titleIn.value;
        const desc = descriptionIn.value;
        const date = parseISO(dateIn.value);
        if (date.toString() === "Invalid Date") {
            date = Date.now();
        }

        let priority = "L";
        for (const b of priorityButtons) {
            if (b.checked) {
                priority = b.value;
                break;
            }
        }

        const checked = checkedIn.checked;

        editedTodo.updateAll(title, desc, date, priority, checked);
        TodoStorage.storeProjects();
        event.preventDefault();
    }

    function checkboxCallback(event) {
        if (!editedTodo) {
            return;
        }
        editedTodo.updateProperty("checked", checkedIn.checked);
        TodoStorage.storeProjects();
    }

    function removeCallback(event) {
        if (!editedTodo) {
            return;
        }
        editedTodo.removeSelf();
        TodoStorage.storeProjects();
        editArea.classList.add("no-display");
    }

    document.getElementById("edit-unexpand").addEventListener("click", unexpandCallback);
    document.getElementById("edit-update").addEventListener("click", updateCallback);
    checkedIn.addEventListener("change", checkboxCallback);
    document.getElementById("edit-remove").addEventListener("click", removeCallback);

    const edit = function(todoData) {
        editedTodo = todoData;
        titleIn.value = todoData.title;
        descriptionIn.value = todoData.description;
        dateIn.value = format(todoData.dueDate, "yyyy-MM-dd");

        for (const b of priorityButtons) {
            if (b.value === todoData.priority) {
                b.checked = true;
                break;
            }
        }

        checkedIn.checked = todoData.checked;
        editArea.classList.remove("no-display");
    };

    const setChecked = function(checked) {
        checkedIn.checked = checked;
    };

    const getEdited = function() {
        return editedTodo;
    }

    return {unexpand, edit, setChecked, getEdited};
})();

export default TodoEditor;
