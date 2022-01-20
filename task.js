export default class Task {
  _inputFromUser = document.querySelector(".task-input");
  _parentElement1 = document.querySelector(".task-main__in-progress");

  _taskMain = document.querySelector(".task-main");
  _todoContainer = document.querySelector(".container");
  _inProgress = [];
  _taskName = "in-progress";
  _isFull = false;
  _currProgressTask = 0;
  _done = [];
  _checkboxArray = [];
  _inputFromUser = document.querySelector(".task-input");
  _parentElement2 = document.querySelector(".task-main__done");
  _done = [];
  // _taskName = "done";
  _currDoneTask = 0;
  constructor() {
    // window.addEventListener("resize", this._calcTaskContainerHeight.bind(this));
    this._getFromLocalStorage1();
    this._parentElement1.addEventListener(
      "change",
      this._removeTaskAndAddToProgress1.bind(this)
    );
    this._getFromLocalStorage2();
    this._parentElement2.addEventListener(
      "change",
      this._removeTaskAndAddToProgress2.bind(this)
    );
  }

  _getInputFromUser(e) {
    const inputText = this._inputFromUser.value;

    if (
      this._inputFromUser === document.activeElement &&
      inputText.length > 0 &&
      e.key === "Enter" &&
      !this._isFull
    ) {
      return this._insertHTML(inputText);
    }
  }

  _generateUniqueNumber() {
    this._uniqueNum = Date.now();
  }

  _renderInProgress() {
    this._inProgress = this._inProgress.map((task) => {
      this._currProgressTask++;

      task = task.replaceAll("ideas", "in-progress");

      return task;
    });

    this._inProgress.forEach((htmlNode, i) => {
      if (i === this._inProgress.length - 1)
        this._parentElement1.insertAdjacentHTML("beforeend", htmlNode);
    });

    this._currProgressTask > 1
      ? (this._checkboxArray = Array.from(
          document.querySelectorAll(".in-progress-checkbox")
        ))
      : this._checkboxArray.push(
          document.querySelector(".in-progress-checkbox")
        );
    this._setLocalStorage1();
  }

  _removeTaskAndAddToProgress1(e) {
    const currentTaskNumber = e.target.closest(".task-main__in-progress-box")
      .dataset.number;
    this._inProgress = this._inProgress.filter((progress, i) => {
      let thenum = progress.match(/\d+/)[0];

      console.log(thenum, currentTaskNumber);
      if (thenum !== currentTaskNumber) return progress;
      else this._done.push(progress);
    });
    setTimeout(() => {
      this._parentElement1.innerHTML = "";
      this._inProgress.forEach((htmlNode, i) => {
        this._parentElement1.insertAdjacentHTML("beforeend", htmlNode);
      });
    }, 300);

    // console.log(this._inProgress);
    this._renderDone();
    this._setLocalStorage1();
  }

  _setLocalStorage1() {
    localStorage.setItem("progress", JSON.stringify(this._inProgress));
  }

  _getFromLocalStorage1() {
    console.log("dadsa");
    console.log(this._inProgress);
    let data = JSON.parse(localStorage.getItem("progress"));
    if (!data) return;
    this._inProgress = data;
    this._inProgress.forEach((htmlNode, i) => {
      this._parentElement1.insertAdjacentHTML("beforeend", htmlNode);
    });
  }

  ///////////////////DONE////////////////////////////////////////////////////////////////

  _renderDone() {
    console.log("DONE DONE");
    this._done = this._done.map((task) => {
      this._currDoneTask++;

      task = task.replaceAll("in-progress", "done");

      return task;
    });
    console.log(`DONE ARRAY:`, this._done);

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

  _removeTaskAndAddToProgress2(e) {
    const currentTaskNumber = e.target.closest(".task-main__done-box").dataset
      .number;
    this._done = this._done.filter((done, i) => {
      let thenum = done.match(/\d+/)[0];

      console.log(thenum, currentTaskNumber);
      if (thenum !== currentTaskNumber) return done;
      // else this._done.push(progress);
    });
    setTimeout(() => {
      this._parentElement2.innerHTML = "";
      this._done.forEach((htmlNode, i) => {
        this._parentElement2.insertAdjacentHTML("beforeend", htmlNode);
      });
    }, 300);

    // console.log(this._inProgress);

    this._setLocalStorage2();
  }

  _setLocalStorage2() {
    localStorage.setItem("done", JSON.stringify(this._done));
  }

  _getFromLocalStorage2() {
    console.log("dadsa");
    console.log(this._done);
    let data = JSON.parse(localStorage.getItem("done"));
    if (!data) return;
    this._done = data;
    this._done.forEach((htmlNode, i) => {
      this._parentElement2.insertAdjacentHTML("beforeend", htmlNode);
    });
  }
}
