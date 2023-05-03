setTimeout(() => {
  document.getElementsByClassName("right-buttons")[0].innerHTML =
    '<button id="zbaButton" type="button">Autocomplete!</button>' +
    document.getElementsByClassName("right-buttons")[0].innerHTML;
  document
    .getElementById("zbaButton")
    .addEventListener("click", zBAStartButton, false);
  // zBAStartButton();
}, 2000);

async function solveMultipleChoice() {
  const questionContainer = document.querySelectorAll(".question-set-question");
  console.log("questionContainer.length:", questionContainer.length);
  for (let i = 0; i < questionContainer.length; i++) {
    const allQuestionChoices = questionContainer[i].querySelector(".question");

    let questionChoices = allQuestionChoices
      ? allQuestionChoices?.querySelector(".question-choices")?.children
      : null;

    if (!questionChoices) continue;

    await solveProblem(questionChoices, i);
  }

  console.log("FInished answering multiple choice questions");
}

async function solveProblem(questionChoices, containerIndex) {
  const questionContainer = document.querySelectorAll(".question-set-question");
  let retry = true;
  let tryQuestionIndex = 0;
  const maxTrys = 10;
  let trys = 0;
  console.log("-------");
  while (retry) {
    if (trys >= maxTrys) return;
    const questionChoice = questionChoices
      ? questionChoices[tryQuestionIndex]?.querySelector("input")
      : null;
    if (!questionChoice) {
      incrementTries("!questionChoice");
      continue;
    }
    console.log("question element was found");
    console.log("Clicking question choice element");
    questionChoice.click();

    // It takes a second for the accuracy element to appear
    await wait();
    const accuracyElement = questionContainer
      ? questionContainer[containerIndex]?.querySelector(".message")?.innerText
      : null;

    if (!accuracyElement) {
      incrementTries("!accuracyElement");
      continue;
    }

    retry = accuracyElement.indexOf("Incorrect") >= 0;
    console.log(`Choice was ${retry ? "incorrect\nTrying again" : "correct"}`);
    if (tryQuestionIndex >= questionChoices.length - 1) tryQuestionIndex = 0;
    else tryQuestionIndex++;
    trys++;

    function incrementTries(fail) {
      console.log("fail:", fail);
      console.log(
        "containerIndex: ",
        containerIndex,
        "tryQuestionIndex:",
        tryQuestionIndex
      );
      console.log("incrementing trys");
      trys++;
    }
  }
  console.log("-------");
}

async function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

async function solveShortAnswerQuestions() {
  let allShortAnswerElements = document.querySelectorAll(
    ".short-answer-question"
  );
  if (!allShortAnswerElements) {
    await wait();
    allShortAnswerElements = document.querySelectorAll(
      ".short-answer-question"
    );
  }

  for (let i = 0; i < allShortAnswerElements.length; i++) {
    const shortAnswerQuestionEle = allShortAnswerElements[i];
    const shortAnswerQuestionShowAnswerEle =
      shortAnswerQuestionEle.querySelector(".show-answer-button");

    const shortAnswerQuestionInputEle =
      shortAnswerQuestionEle.querySelector(".ember-text-area");
    const checkButtonEle =
      shortAnswerQuestionEle.querySelector(".check-button");
    shortAnswerQuestionShowAnswerEle.click();
    await wait();
    shortAnswerQuestionShowAnswerEle.click();
    await wait();
    const answerEle = shortAnswerQuestionEle.querySelector(".forfeit-answer");
    shortAnswerQuestionInputEle.click();
    shortAnswerQuestionInputEle.innerHTML = answerEle.innerText;
    shortAnswerQuestionInputEle.value = answerEle.innerText;
    const spaceBarPress = new KeyboardEvent("keypress", { key: " " });
    const changeEvent = new Event("change");
    shortAnswerQuestionInputEle.dispatchEvent(spaceBarPress);
    shortAnswerQuestionInputEle.dispatchEvent(changeEvent);
    checkButtonEle.click();
  }
}

async function zBAStartButton(zEvent) {
  console.log(timeString() + " [zBA] Running...");
  await solveMultipleChoice();
  await solveShortAnswerQuestions();
  run();
}

function run() {
  //click_speeds();
  click_plays();
  click_starts();
  setTimeout(function () {
    run();
  }, 1000);
}

function click_speeds() {
  // Checks speed boxes. Doesn't work but isn't a necessary feature.
  var speed = document.getElementsByClassName("speed-control");
  for (var i = 0; i < speed.length; i++) {
    if (speed[i].innerHTML.includes("false")) {
      //speed[i].click();
      speed[i].getElementsByClassName("zb-checkbox")[0].innerHTML =
        '\n<input type="checkbox" value="true" aria-label="2x speed">\n<label aria-hidden="true">2x speed</label>\n';
      console.log(timeString() + " Checked a speed box.");
    }
  }
}

function click_plays() {
  // Clicks all Play buttons
  var plays = document.getElementsByClassName("play-button");
  for (var i = 0; i < plays.length; i++) {
    if (!plays[i].classList.contains("rotate-180")) {
      plays[i].click();
      console.log(timeString() + " Clicked a play button.");
    }
  }
}

function click_starts() {
  // Clicks all Start buttons
  var starts = document.getElementsByClassName("start-button");
  for (var i = 0; i < starts.length; i++) {
    starts[i].click();
    console.log(timeString() + " Clicked a start button.");
  }
}

function timeString() {
  let d = new Date();
  let h = (d.getHours() < 10 ? "0" : "") + d.getHours();
  let m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  let s = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
  let dstr = h + ":" + m + ":" + s;
  return dstr;
}
