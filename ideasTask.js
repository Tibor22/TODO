import Task from "./task.js";

class ideasTask extends Task {
  _parentElement = document.querySelector(".task-main__ideas");
  _ideasArray = [];
  _checkboxArray = [];
  _labelName = "ideas";
  _uniqueNum;
  _currIdeasTask = 0;
  _nextTask = [];
  constructor() {
    super();
    this._getFromLocalStorage();
    this._parentElement.addEventListener(
      "change",
      this._removeTaskAndAddToProgress.bind(this)
    );
  }

  _insertHTML(text) {
    this._generateUniqueNumber();
    console.log(this._uniqueNum);
    this._currIdeasTask++;
    this._inputFromUser.value = "";
    const html = `<div class="task-main__ideas-box--${this._uniqueNum} task-main__ideas-box" data-number='${this._uniqueNum}'>
    <input class="ideas-checkbox--${this._uniqueNum} ideas-checkbox" type="checkbox" />
    <p contenteditable="true" class="ideas-text-preview--${this._uniqueNum} ideas-text-preview">${text}</p>
  </div>`;
    console.log(this._ideasArray);
    this._ideasArray.push(html);

    this._ideasArray.forEach((htmlNode, i) => {
      if (i === this._ideasArray.length - 1)
        this._parentElement.insertAdjacentHTML("beforeend", htmlNode);
    });

    this._currIdeasTask > 1
      ? (this._checkboxArray = Array.from(
          document.querySelectorAll(".ideas-checkbox")
        ))
      : this._checkboxArray.push(document.querySelector(".ideas-checkbox"));
    this._setLocalStorage();
  }

  _removeTaskAndAddToProgress(e) {
    const currentTaskNumber = e.target.closest(".task-main__ideas-box").dataset
      .number;
    this._ideasArray = this._ideasArray.filter((ideas, i) => {
      let thenum = ideas.match(/\d+/)[0];

      console.log(thenum, currentTaskNumber);
      if (thenum !== currentTaskNumber) return ideas;
      else this._nextTask.push(ideas);
    });
    setTimeout(() => {
      this._parentElement.innerHTML = "";
      this._ideasArray.forEach((htmlNode, i) => {
        this._parentElement.insertAdjacentHTML("beforeend", htmlNode);
      });
    }, 300);

    console.log(this._inProgress);
    this._renderInProgress(this._nextTask);
    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this._ideasArray));
  }

  _getFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;
    this._ideasArray = data;
    this._ideasArray.forEach((htmlNode, i) => {
      this._parentElement.insertAdjacentHTML("beforeend", htmlNode);
    });
  }
}

export default new ideasTask();

console.log("fdsfdsdsfdsf");
console.log("fdsfdsdsfdsf");
console.log("fdsfdsdsfdsf");
