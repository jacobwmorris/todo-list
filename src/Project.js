
class Project {
  name = "default";
  todoList = [];

  constructor(name, todoList) {
    this.name = name;
    this.todoList = todoList;
  }
}

class Todo {
  title = "";
  desc = "";
  due = null;
  priority = "M";
  checked = false;

  constructor(title, desc, due, priority, checked) {
    this.title = title;
    this.desc = desc;
    this.due = due;
    this.priority = priority;
    this.checked = checked;
  }
}

const todoConverter = {
  toFirestore: (todo) => {
    return {
      title: todo.title,
      desc: todo.desc,
      due: todo.due,
      priority: todo.priority,
      checked: todo.checked
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Todo(data.title, data.desc, data.due, data.priority, data.checked);
  }
}

export {Project, Todo, todoConverter};
