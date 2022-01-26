// const inputFromUser = document.querySelector(".task-input");

class Task {
  constructor(name, id, text) {
    this.name = name;
    this.id = id;
    this.text = text;
    this.taskArr = [];
  }
}

class Ideas extends Task {
  parentElement = document.querySelector(".task-main__ideas");
  _checkboxArray = [];
}

class Progress extends Task {
  parentElement = document.querySelector(".task-main__in-progress");
}

class Done extends Task {
  parentElement = document.querySelector(".task-main__done");
}

class App {
  _inputFromUser = document.querySelector(".task-input");
  _taskMain = document.querySelector(".task-main");
  _ideasArr = [];
  _progressArr = [];
  _doneArr = [];
  _taskName;
  _isFull = false;
  _currProgressTask = 0;
  _uniqueNum;
  _currDoneTask = 0;
  _progressCounter = 0;

  constructor() {
    this._getFromLocalStorage();
    this._inputFromUser.addEventListener(
      "keyup",
      this._getInputFromUser.bind(this)
    );
    this._taskMain.addEventListener(
      "change",
      this._removeTaskAndAddNext.bind(this)
    );
  }

  // METHODS

  // Get input from the user
  _getInputFromUser(e) {
    const inputText = this._inputFromUser.value;

    if (
      this._inputFromUser === document.activeElement &&
      inputText.length > 0 &&
      e.key === "Enter" &&
      !this._isFull
    ) {
      return this._createNewTask(inputText);
    }
  }

  // Generate id
  _generateUniqueNumber() {
    return Date.now();
  }

  // Create new ideas/progress/done
  _createNewTask(text) {
    // IF there is text create ideas
    if (text.length > 0) {
      let id = this._generateUniqueNumber();
      let task;

      task = new Ideas("ideas", id, text);

      // Add task object to taskArr
      this._ideasArr.push(task);

      // insert new task in HTML
      this._insertHTML(task);

      this._setLocalStorage("ideas", this._ideasArr);
    }
  }

  _insertHTML(task) {
    this._currIdeasTask++;
    this._inputFromUser.value = "";
    const html = `<div class="task-main__${task.name}-box--${task.id} task-main__${task.name}-box" data-number='${task.id}'>
    <input class="${task.name}-checkbox--${task.id} ${task.name}-checkbox" type="checkbox" />
    <p contenteditable="true" class="${task.name}-text-preview--${task.id} ${task.name}-text-preview">${task.text}</p>
  </div>`;
    task.parentElement.insertAdjacentHTML("beforeend", html);
    task.description = html;
  }
  _createObj(arr, oldName, newName) {
    arr = arr.map((obj, i) => {
      if (arr[i].id === obj.id) {
        let arr1 =
          arr[arr.length - 1].name === "ideas"
            ? new Progress(`${newName}`, obj.id, obj.text)
            : new Done(`${newName}`, obj.id, obj.text);
        arr1.description = obj.description.replaceAll(
          `${oldName}`,
          `${newName}`
        );
        if (arr.length - 1 === i) {
          this._insertHTML(arr1);
        }
        return arr1;
      }
    });
    return arr;
  }

  _delayAndRenderToHTML(parentEl, arr) {
    setTimeout(() => {
      parentEl.innerHTML = "";
      arr.forEach((htmlNode, i) => {
        this._insertHTML(htmlNode);
      });
    }, 300);
  }

  _filterArrAndRemove(oldArr, newArr, currentTaskNumber) {
    oldArr = oldArr.filter((obj, i) => {
      let thenum = obj.id;
      if (thenum !== +currentTaskNumber) return obj;
      else newArr === "_" ? null : newArr.push(obj);
    });
    return oldArr;
  }

  _removeTaskAndAddNext(e) {
    const currentTaskNumber =
      e.target.closest(`.task-main__ideas-box`)?.dataset.number ||
      e.target.closest(`.task-main__in-progress-box`)?.dataset.number ||
      e.target.closest(`.task-main__done-box`)?.dataset.number;
    let parentProgress = this._progressArr[0]?.parentElement;
    let parentDone = this._doneArr[0]?.parentElement;
    let parentIdeas = this._ideasArr[0]?.parentElement;
    let checkWhichContainer = e.target.parentElement.outerHTML;

    if (checkWhichContainer.includes("ideas")) {
      //REMOVE CLICKED OBJ
      this._ideasArr = this._filterArrAndRemove(
        this._ideasArr,
        this._progressArr,
        currentTaskNumber
      );

      //RENDER
      this._delayAndRenderToHTML(parentIdeas, this._ideasArr);
      // CREATE PROGRESS OBJECT
      this._progressArr = this._createObj(
        this._progressArr,
        "ideas",
        "in-progress"
      );
      this._setLocalStorage("ideas", this._ideasArr);
      this._setLocalStorage("in-progress", this._progressArr);
    } else if (checkWhichContainer.includes("in-progress")) {
      // REMOVE CLICKED OBJ
      this._progressArr = this._filterArrAndRemove(
        this._progressArr,
        this._doneArr,
        currentTaskNumber
      );

      //RENDER
      this._delayAndRenderToHTML(parentProgress, this._progressArr);
      // CREATE DONE OBJECT
      this._doneArr = this._createObj(this._doneArr, "in-progress", "done");
      this._setLocalStorage("in-progress", this._progressArr);
    } else if (checkWhichContainer.includes("done")) {
      // REMOVE CLICKED OBJ
      this._doneArr = this._filterArrAndRemove(
        this._doneArr,
        "_",
        currentTaskNumber
      );
      //RENDER
      this._delayAndRenderToHTML(parentDone, this._doneArr);
    }
    this._setLocalStorage("done", this._doneArr);
  }

  _setLocalStorage(name, arr) {
    localStorage.setItem(`${name}`, JSON.stringify(arr));
  }

  _getFromLocalStorage() {
    let dataIdeas = JSON.parse(localStorage.getItem("ideas"));
    let dataProgress = JSON.parse(localStorage.getItem("in-progress"));
    let dataDone = JSON.parse(localStorage.getItem("done"));
    console.log(dataIdeas, dataProgress, dataDone);
    if (!dataIdeas || !dataProgress || !dataDone) return;
    this._ideasArr = dataIdeas;
    dataIdeas?.forEach((htmlNode, i) => {
      htmlNode.parentElement = document.querySelector(".task-main__ideas");
      this._insertHTML(htmlNode);
    });
    this._progressArr = dataProgress;
    dataProgress?.forEach((htmlNode, i) => {
      htmlNode.parentElement = document.querySelector(
        ".task-main__in-progress"
      );
      this._insertHTML(htmlNode);
    });
    this._doneArr = dataDone;
    dataDone?.forEach((htmlNode, i) => {
      htmlNode.parentElement = document.querySelector(".task-main__done");
      this._insertHTML(htmlNode);
    });
  }
}

const app = new App();
