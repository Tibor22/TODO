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
  _delete = document.querySelector(".delete");
  _ideasArr = [];
  _progressArr = [];
  _doneArr = [];
  _taskName;
  _isFull = false;
  _currProgressTask = 0;
  _uniqueNum;
  _currDoneTask = 0;
  _progressCounter = 0;
  _time = ".daily";

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
    this._taskMain.forEach((task) => {
      task.addEventListener("click", this._deleteTask.bind(this));
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
    <div class='delete'><i class="fas fa-times"></i></div>
  </div>`;
    // console.log(task.parentElement, task);
    task.parentElement.insertAdjacentHTML("beforeend", html);
    task.description = html;
  }
  _createObj(arr, oldName, newName) {
    console.log(`YES I AM HERE`);
    arr = arr.map((obj, i) => {
      console.log("START:", obj);
      if (arr[i].id === obj.id) {
        let arr1 =
          arr[arr.length - 1].name === "ideas"
            ? new Progress(`${newName}`, obj.id, obj.text, obj.mainContainer)
            : new Done(`${newName}`, obj.id, obj.text, obj.mainContainer);
        arr1.description = obj.description.replaceAll(
          `${oldName}`,
          `${newName}`
        );
        if (arr.length - 1 === i) {
          this._insertHTML(arr1);
        }
        console.log("END:", obj);
        return arr1;
      }
    });
    return arr;
  }

  _delayAndRenderToHTML(parentEl, arr) {
    setTimeout(() => {
      console.log("-------------------------------------------------------");
      // console.log(parentEl);
      // // parentEl.innerHTML = "";
      // console.log(parentEl.classList[0]);
      console.log(arr);
      // parentEl.classList[0]
      document.querySelectorAll(`.${parentEl.classList[0]}`).forEach((task) => {
        task.innerHTML = "";
      });
      // this._insertHTML(arr[0]);
      console.log(arr);
      arr.forEach((htmlNode, i) => {
        // if (i === arr.length - 1) {
        //   console.log(htmlNode);
        console.log(htmlNode);
        this._insertHTML(htmlNode);

        // }
      });
    }, 100);
    console.log("-------------------------------------------");
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
  }

  _deleteTask(e) {
    console.log(e.target);
    if (e.target.classList[0] === "fas") {
      let currentTaskNumber =
        e.target.closest(`.task-main__ideas-box`)?.dataset.number ||
        e.target.closest(`.task-main__in-progress-box`)?.dataset.number ||
        e.target.closest(`.task-main__done-box`)?.dataset.number;
      console.log(this._ideasArr);
      console.log(currentTaskNumber);
      let parentIdeas = this._ideasArr[0]?.parentElement;
      let parentProgress = this._progressArr[0]?.parentElement;
      let parentDone = this._doneArr[0]?.parentElement;

      this._ideasArr = this._ideasArr.filter((obj, i) => {
        currentTaskNumber = +currentTaskNumber;
        console.log(currentTaskNumber, obj.id);
        if (currentTaskNumber !== obj.id) return obj;
        else return "";
      });

      this._progressArr = this._progressArr.filter((obj, i) => {
        currentTaskNumber = +currentTaskNumber;

        if (currentTaskNumber !== obj.id) return obj;
      });
      this._doneArr = this._doneArr.filter((obj, i) => {
        currentTaskNumber = +currentTaskNumber;

        if (currentTaskNumber !== obj.id) return obj;
      });
      console.log(e.target.parentNode.parentElement.outerHTML);
      let checkWhichContainer = e.target.parentNode.parentElement.outerHTML;
      if (checkWhichContainer.includes("ideas")) {
        console.log("right");
        if (this._ideasArr.length > 0) {
          this._delayAndRenderToHTML(parentIdeas, this._ideasArr);
        } else {
          parentIdeas.innerHTML = "";
        }
        this._setLocalStorage("ideas", this._ideasArr);
      }
      if (checkWhichContainer.includes("in-progress")) {
        console.log(this._progressArr);
        console.log("left");
        if (this._progressArr.length > 0) {
          this._delayAndRenderToHTML(parentProgress, this._progressArr);
        } else {
          parentProgress.innerHTML = "";
        }
        this._setLocalStorage("in-progress", this._progressArr);
      }
      if (checkWhichContainer.includes("done")) {
        console.log("forward");
        if (this._doneArr.length > 0) {
          this._delayAndRenderToHTML(parentDone, this._doneArr);
        } else {
          parentDone.innerHTML = "";
        }
        this._setLocalStorage("done", this._doneArr);
      }
    }
  }

  _setLocalStorage(name, arr) {
    localStorage.setItem(`${name}`, JSON.stringify(arr));
  }

  _setLocalStorageParentEl(htmlNode, time, name) {
    if (htmlNode.mainContainer === `${time}`) {
      htmlNode.parentElement = document.querySelector(`${time}-${name}`);
    }
  }

  _getFromLocalStorage() {
    let dataIdeas = JSON.parse(localStorage.getItem("ideas"));
    let dataProgress = JSON.parse(localStorage.getItem("in-progress"));
    let dataDone = JSON.parse(localStorage.getItem("done"));

    if (!dataIdeas || !dataProgress || !dataDone) return;
    this._ideasArr = dataIdeas;
    dataIdeas?.forEach((htmlNode, i) => {
      this._setLocalStorageParentEl(htmlNode, ".daily", "ideas");
      this._setLocalStorageParentEl(htmlNode, ".weekly", "ideas");
      this._setLocalStorageParentEl(htmlNode, ".monthly", "ideas");
      this._insertHTML(htmlNode);
    });
    this._progressArr = dataProgress;
    dataProgress?.forEach((htmlNode, i) => {
      this._setLocalStorageParentEl(htmlNode, ".daily", "in-progress");
      this._setLocalStorageParentEl(htmlNode, ".weekly", "in-progress");
      this._setLocalStorageParentEl(htmlNode, ".monthly", "in-progress");
      this._insertHTML(htmlNode);
    });
    this._doneArr = dataDone;
    dataDone?.forEach((htmlNode, i) => {
      this._setLocalStorageParentEl(htmlNode, ".daily", "done");
      this._setLocalStorageParentEl(htmlNode, ".weekly", "done");
      this._setLocalStorageParentEl(htmlNode, ".monthly", "done");
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
