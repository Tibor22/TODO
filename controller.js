import task from "./task.js";
import ideasTask from "./ideasTask.js";

// console.log(task);

const inputFromUser = document.querySelector(".task-input");

inputFromUser.addEventListener(
  "keyup",
  ideasTask._getInputFromUser.bind(ideasTask)
);
