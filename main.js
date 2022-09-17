(function (window) {
  "strict";

  let state = {
    currentNumber: 0,
    score: 0,
    lastResult: 0
  };

  let appElem = document.getElementById('app')
    , displayElem = document.getElementById('display')
    , answerElem = document.getElementById('answer')
    , scoreElem = document.getElementById('score')
    , scoreBox = document.getElementById('score-box')
    , startButton = document.getElementById('start')
    ;

  function nextNumber() {
    let n = Math.round(Math.random() * 1000);
    return n;
  }

  function mainLoop(keepCurrent) {
    if (!keepCurrent) {
      state.currentNumber = nextNumber();
      state.display = '';
    } else {
      // TODO: work out how to put the number in words
      if (state.lastResult <= -2) {
        state.display = '' + state.currentNumber;
      }
    }

    let lang = 'de'

    let voices = window.speechSynthesis.getVoices().filter(voice => {
      return voice.lang && voice.lang.startsWith(lang);
    });

    let msg = new SpeechSynthesisUtterance();
    msg.text = '' + state.currentNumber;
    msg.lang = lang;
    msg.rate = 1.25;
    if (voices.length) {
      msg.voice = voices[Math.floor(Math.random() * voices.length)];
    }
    msg.onerror = (e) => { console.log(e); };
    speechSynthesis.speak(msg);

    scoreElem.innerText = '' + state.score;

    scoreBox.classList.remove('score-green');
    scoreBox.classList.remove('score-red');
    if (state.lastResult > 0) {
      scoreBox.classList.add('score-green');
    } else if (state.lastResult < 0) {
      scoreBox.classList.add('score-red');
    }
    displayElem.innerText = state.display;
  }

  answerElem.oninput = () => {
    if (answerElem.value.length >= ("" + state.currentNumber).length) {
      if (answerElem.valueAsNumber === state.currentNumber) {
        state.score += 1;
        // some sort of state.last result
        state.lastResult = 1;
        answerElem.value = '';
        mainLoop();
      } else {
        if (state.lastResult == 1) {
          state.lastResult = -1;
        } else {
          state.lastResult -= 1;
        }
        answerElem.value = '';
        mainLoop(true);
      }
    }
  };

  startButton.onclick = function () {
    window.setTimeout(mainLoop, 500);
    window.setTimeout(function() {
      let gameOver = document.getElementById('game-over');
      gameOver.classList.remove('hidden');
      answerElem.disabled = true;
    }, 60 * 1000);
    startButton.disabled = true;
  }

  // For debugging
  window.appState = state;
})(this);
