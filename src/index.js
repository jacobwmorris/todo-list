//import {format} from "date-fns";
import {TodoItem, Project} from "./todos.js";

/* let d = new Date(2000, 0, 1);
console.log(format(d, "MM/dd/yyyy")); */

const testProj = Project("test");
testProj.add(TodoItem("do thing", "things", Date(1999, 11, 31), 2));
testProj.add(TodoItem("do another thing", "things", Date(1999, 11, 30), 1));
testProj.update()
