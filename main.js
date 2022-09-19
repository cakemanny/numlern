(function (window) {
  "strict";

  let state = {
    settings: {
      digits: 3,
      lang: 'de',
      speechRate: 1.25,
    },
    currentNumber: 0,
    score: 0,
    lastResult: 0
  };
  function resetState() {
    state.currentNumber = 0;
    state.score = 0;
    state.lastResult = 0;
  };

  const displayElem = document.getElementById('display')
    , answerElem = document.getElementById('answer')
    , scoreElem = document.getElementById('score')
    , scoreBox = document.getElementById('score-box')
    , startButton = document.getElementById('start')
    , gameOverElem = document.getElementById('game-over')
    , digitsElem = document.getElementById('digits')
    , langElem = document.getElementById('lang')
    , speechRateElem = document.getElementById('speech-rate')
    ;

  function nextNumber(settings) {
    let n = Math.round(Math.random() * (10 ** state.settings.digits));
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

    let voices = window.speechSynthesis.getVoices().filter(voice => {
      return voice.lang && voice.lang.startsWith(state.settings.lang);
    });

    let msg = new SpeechSynthesisUtterance();
    msg.text = '' + state.currentNumber;
    msg.lang = state.settings.lang;
    msg.rate = state.settings.speechRate;
    if (voices.length) {
      msg.voice = voices[Math.floor(Math.random() * voices.length)];
    }
    msg.onerror = (e) => { console.log(e); };
    speechSynthesis.speak(msg);

    // Render
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

  digitsElem.onchange = () => {
    // |0 convert to int
    state.settings.digits = digitsElem.valueAsNumber|0;
  };
  langElem.onchange = () => {
    state.settings.lang = langElem.value;
  };
  speechRateElem.onchange = () => {
    state.settings.speechRate = speechRateElem.valueAsNumber;
  };

  startButton.onclick = function () {
    resetState();
    window.setTimeout(mainLoop, 0);

    window.setTimeout(function() {
      gameOverElem.classList.remove('hidden');
      answerElem.disabled = true;
      startButton.disabled = false;
    }, 60 * 1000);
    gameOverElem.classList.add('hidden');
    startButton.disabled = true;
    answerElem.disabled = false;
    answerElem.value = '';
    answerElem.focus();
  }

  // For debugging
  window.appState = state;
})(this);
