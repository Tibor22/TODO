class DoneTask extends Task {
  _inputFromUser = document.querySelector(".task-input");
  _parentElement2 = document.querySelector(".task-main__done");
  _done = [];
  _taskName = "done";
  _currDoneTask = 0;
  constructor() {
    super();
    this._getFromLocalStorage2();
    this._parentElement1.addEventListener(
      "change",
      this._removeTaskAndAddToProgress2.bind(this)
    );
  }

  _renderDone() {
    console.log("DONE DONE");
    this._done = this._done.map((task) => {
      this._currDoneTask++;

      task = task.replaceAll("in-progress", "done");

      return task;
    });

    this._done.forEach((htmlNode, i) => {
      if (i === this._done.length - 1)
        this._parentElement2.insertAdjacentHTML("beforeend", htmlNode);
    });

    this._currDoneTask > 1
      ? (this._checkboxArray = Array.from(
          document.querySelectorAll(".in-done-checkbox")
        ))
      : this._checkboxArray.push(document.querySelector(".in-done-checkbox"));
    this._setLocalStorage2();
  }

  _setLocalStorage2() {
    localStorage.setItem("progress", JSON.stringify(this._done));
  }

  _getFromLocalStorage2() {
    console.log("dadsa");
    console.log(this._done);
    let data = JSON.parse(localStorage.getItem("progress"));
    if (!data) return;
    this._done = data;
    this._done.forEach((htmlNode, i) => {
      this._parentElement2.insertAdjacentHTML("beforeend", htmlNode);
    });
  }
}

export default new DoneTask();
