const {
  elementDictionary,
  setElDictItemVisible,
} = require('./elementDictionary.js');

let els = {};
let screens = {};

// Scroll to top of page
const scrollToTop = () => {
  window.scrollTo(0, 0);
};

// Switch to a screen by its name (as per the initialization of "screens" dictionary,
// this is the id minus the "Screens" at the end)
const setScreen = (name) => {
  setElDictItemVisible(screens, 'activeScreen', name);
  // Go to the top of this newly-switched screen
  scrollToTop();
};

// Go to waiting screen with message
const waitWithMessage = (message) => {
  els.waitingMessage.innerText = message;
  setScreen('waiting');
};

// Populate "fill in the blanks" form from a given ordered list of word types
const promptToFillInBlanks = (wordTypes) => {
  els.fillInBlanksFormBlanks.innerHTML = wordTypes.map((wordType, index) => `<div><label for="${index}">${wordType}:</label><input type="text" name="${index}"></div>`).join('');
  setScreen('fillInBlanks');
};

// Go to results screen with story
const seeResults = (storyHTML) => {
  let formattedHTML = '';
  if (storyHTML.includes('Title:')) {
    // format title of story
    const indexStartStory = storyHTML.indexOf('\n');
    const title = storyHTML.substring(storyHTML.indexOf('Title:') + 7, indexStartStory);
    console.log('title', title);
    formattedHTML += `<strong>${title}</strong><br>`;

    // add rest of story
    formattedHTML += storyHTML.substring(indexStartStory, storyHTML.length - 1);
  } else {
    formattedHTML = storyHTML;
  }
  els.finishedStory.innerHTML = formattedHTML;
  setScreen('results');
};

// Return to start screen to display a game-stopping error
const exitWithError = (message) => {
  els.errorMessage.innerText = message;
  setScreen('start');
};

const initScreenManagement = () => {
  // List of screen-relevant elements that will be interfaced with
  els = elementDictionary([
    'errorMessage',
    'waitingMessage',
    'fillInBlanksFormBlanks',
    'finishedStory',
  ]);

  // List of screens that will be seen during gameplay (entering game code, drawing, waiting, etc.)
  screens = elementDictionary([
    'start',
    'waiting',
    'fillInBlanks',
    'results',
  ], (e) => `${e}Screen`);

  // setScreen('results'); // Uncomment this line to debug a specific screen
};

module.exports = {
  scrollToTop,
  waitWithMessage,
  promptToFillInBlanks,
  seeResults,
  exitWithError,
  initScreenManagement,
};
