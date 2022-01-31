// const inputFromUser = document.querySelector(".task-input");

class Task {
  constructor(name, id, text, mainContainer) {
    this.name = name;
    this.id = id;
    this.text = text;
    // this.taskArr = [];
    this.mainContainer = mainContainer;
  }

  getParentIdeas() {
    let parent = document.querySelector(`${this.mainContainer}`);
    let child = parent.querySelector(".task-main__ideas");
    return child;
  }
  getParentProgress() {
    let parent = document.querySelector(`${this.mainContainer}`);
    let child = parent.querySelector(".task-main__in-progress");

    return child;
  }
  getParentDone() {
    let parent = document.querySelector(`${this.mainContainer}`);
    let child = parent.querySelector(".task-main__done");
    return child;
  }
}

class Ideas extends Task {
  // parentElement = this.mainContainer;
  // // .querySelector(".task-main__ideas");
  // // _checkboxArray = [];

  parentElement = this.getParentIdeas();
}

class Progress extends Task {
  parentElement = this.getParentProgress();
  // parentElement = this.mainContainer;
  // .querySelector(".task-main__in-progress");
}

class Done extends Task {
  parentElement = this.getParentDone();
  // parentElement = this.mainContainer.firstElementChild;
  // .querySelector(".task-main__done");
}

class App {
  // daily = document.querySelector(".daily");
  // monthly = document.querySelector(".monthly");
  // weekly = document.querySelector(".weekly");

  _inputFromUser = document.querySelector(".task-input");
  _taskMain = document.querySelectorAll(".task-main");
  _navigationContainer = document.querySelector(".navigation-container");
  _navArr = document.querySelectorAll(".nav-items");
  _ideasArr = [];
  _progressArr = [];
  _doneArr = [];
  _taskName;
  _isFull = false;
  _currProgressTask = 0;
  _uniqueNum;
  _currDoneTask = 0;
  _progressCounter = 0;
  _time;

  constructor() {
    this._getFromLocalStorage();
    this._init();
    this._navigationContainer.addEventListener(
      "click",
      this._createTime.bind(this)
    );
    this._inputFromUser.addEventListener(
      "keyup",
      this._getInputFromUser.bind(this)
    );
    this._taskMain.forEach((task) => {
      task.addEventListener("change", this._removeTaskAndAddNext.bind(this));
    });
  }

  _createTime(e) {
    this._time = "." + e.target.innerText.toLowerCase();

    if (this._time === ".daily") {
      document.querySelector(".weekly").style.display = "none";
      document.querySelector(".monthly").style.display = "none";
      document.querySelector(".daily").style.display = "grid";
      this._navArr[0].style.backgroundColor = "white";
      this._navArr[1].style.backgroundColor = "";
      this._navArr[2].style.backgroundColor = "";
    }
    if (this._time === ".weekly") {
      document.querySelector(".weekly").style.display = "grid";
      document.querySelector(".monthly").style.display = "none";
      document.querySelector(".daily").style.display = "none";
      this._navArr[1].style.backgroundColor = "white";
      this._navArr[0].style.backgroundColor = "";
      this._navArr[2].style.backgroundColor = "";
    }
    if (this._time === ".monthly") {
      document.querySelector(".weekly").style.display = "none";
      document.querySelector(".monthly").style.display = "grid";
      document.querySelector(".daily").style.display = "none";
      this._navArr[0].style.backgroundColor = "";
      this._navArr[1].style.backgroundColor = "";
      this._navArr[2].style.backgroundColor = "white";
    }
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

      task = new Ideas("ideas", id, text, this._time);

      // Add task object to ideasArr
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
    console.log(task.parentElement, task);
    task.parentElement.insertAdjacentHTML("beforeend", html);
    task.description = html;
  }
  _createObj(arr, oldName, newName) {
    arr = arr.map((obj, i) => {
      if (arr[i].id === obj.id) {
        let arr1 =
          arr[arr.length - 1].name === "ideas"
            ? new Progress(`${newName}`, obj.id, obj.text, this._time)
            : new Done(`${newName}`, obj.id, obj.text, this._time);
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
      console.log(parentEl);
      // parentEl.innerHTML = "";
      console.log(parentEl.classList[0]);
      document.querySelectorAll(`.${parentEl.classList[0]}`).forEach((task) => {
        task.innerHTML = "";
      });
      // this._insertHTML(arr[0]);

      arr.forEach((htmlNode, i) => {
        // if (i === arr.length - 1) {
        //   console.log(htmlNode);
        this._insertHTML(htmlNode);
        // }
      });
    }, 300);
  }

  _filterArrAndRemove(oldArr, newArr, currentTaskNumber) {
    oldArr = oldArr.filter((obj, i) => {
      let thenum = obj.id;
      console.log(obj, currentTaskNumber);
      if (thenum !== +currentTaskNumber) return obj;
      else newArr === "_" ? null : newArr.push(obj);
    });
    console.log(oldArr);
    return oldArr;
  }

  _removeTaskAndAddNext(e) {
    let currentTaskNumber =
      e.target.closest(`.task-main__ideas-box`)?.dataset.number ||
      e.target.closest(`.task-main__in-progress-box`)?.dataset.number ||
      e.target.closest(`.task-main__done-box`)?.dataset.number;

    const currentIdeas = this._ideasArr.filter((obj, i) => {
      currentTaskNumber = +currentTaskNumber;

      if (currentTaskNumber === obj.id) return obj;
    });
    const currentProgress = this._progressArr.filter((obj, i) => {
      currentTaskNumber = +currentTaskNumber;

      if (currentTaskNumber === obj.id) return obj;
    });
    const currentDone = this._doneArr.filter((obj, i) => {
      currentTaskNumber = +currentTaskNumber;

      if (currentTaskNumber === obj.id) return obj;
    });

    let parentIdeas = currentIdeas[0]?.parentElement;
    let parentProgress = currentProgress[0]?.parentElement;
    let parentDone = currentDone[0]?.parentElement;
    let checkWhichContainer = e.target.parentElement.outerHTML;

    if (checkWhichContainer.includes("ideas")) {
      console.log("right");
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

    console.log(this._ideasArr);
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
      const parentArr = document.querySelectorAll(".task-main__ideas");
      console.log(parentArr);
      if (htmlNode.mainContainer === ".daily") {
        htmlNode.parentElement = document.querySelector(".daily-ideas");
      }
      if (htmlNode.mainContainer === ".weekly") {
        htmlNode.parentElement = document.querySelector(".weekly-ideas");
      }
      if (htmlNode.mainContainer === ".monthly") {
        htmlNode.parentElement = document.querySelector(".monthly-ideas");
      }
      console.log(htmlNode.parentElement);
      this._insertHTML(htmlNode);
    });
    this._progressArr = dataProgress;
    dataProgress?.forEach((htmlNode, i) => {
      // htmlNode.parentElement = document.querySelector(
      //   ".task-main__in-progress"
      // );
      if (htmlNode.mainContainer === ".daily") {
        htmlNode.parentElement = document.querySelector(".daily-in-progress");
      }
      if (htmlNode.mainContainer === ".weekly") {
        htmlNode.parentElement = document.querySelector(".weekly-in-progress");
      }
      if (htmlNode.mainContainer === ".monthly") {
        htmlNode.parentElement = document.querySelector(".monthly-in-progress");
      }
      this._insertHTML(htmlNode);
    });
    this._doneArr = dataDone;
    dataDone?.forEach((htmlNode, i) => {
      if (htmlNode.mainContainer === ".daily") {
        htmlNode.parentElement = document.querySelector(".daily-done");
      }
      if (htmlNode.mainContainer === ".weekly") {
        htmlNode.parentElement = document.querySelector(".weekly-done");
      }
      if (htmlNode.mainContainer === ".monthly") {
        htmlNode.parentElement = document.querySelector(".monthly-done");
      }
      this._insertHTML(htmlNode);
    });
  }

  _init() {
    document.querySelector(".weekly").style.display = "none";
    document.querySelector(".monthly").style.display = "none";
    document.querySelector(".daily").style.display = "grid";
    this._navArr[0].style.backgroundColor = "white";
    this._navArr[1].style.backgroundColor = "";
    this._navArr[2].style.backgroundColor = "";
  }
}

// console.log(daily, weekly, monthly);

const appDaily = new App();

console.log(appDaily);
