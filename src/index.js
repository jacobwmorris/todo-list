import {format} from "date-fns";
document.querySelector("body").appendChild(document.createTextNode("asdf"));
let d = new Date(2000, 0, 1);
console.log(format(d, "MM/dd/yyyy"));
