const {
  elementDictionary,
} = require('./elementDictionary.js');
const {
  scrollToTop,
  waitWithMessage,
  promptToFillInBlanks,
  seeResults,
  exitWithError,
  initScreenManagement,
} = require('./screenManagement.js');
const {
  waitForImageWithMessage,
  setImageSrc,
  showImageError,
  initImageManagement,
} = require('./imageManagement.js');

// Global variables
let els = {};
let blanksFilledInCallback;

// Handle story generation API request
const fetchStory = async () => {
  const response = await fetch('/generate-story');
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.content;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Validate "fill in the blanks" form input and call "blanksFilledInCallback"
// with the user's respectively-ordered inputs if successful
const fillInBlanksFormHandler = (evt) => {
  evt.preventDefault();
  const blankFills = [];
  let noMissedRequirements = true;
  els.fillInBlanksFormBlanks.querySelectorAll('input').forEach((input) => {
    const inputValue = input.value;
    blankFills.push(inputValue);
    if (inputValue.length > 0) {
      input.classList.remove('formMissedRequirement');
    } else {
      input.classList.add('formMissedRequirement');
      noMissedRequirements = false;
    }
  });
  if (noMissedRequirements) {
    blanksFilledInCallback(blankFills);
  } else {
    scrollToTop();
  }
};

const getWordTypes = (prompt) => {
  const helper = [];
  const wordTypes = [];
  for (let i = 0; i < prompt.length; i++) {
    if (prompt[i] === '[') {
      helper.push(i);
    } else if ((prompt[i] === ']') && (helper.length > 0)) {
      const pos = helper[helper.length - 1];
      helper.pop();

      const len = i - 1 - pos;
      let ans;
      if (pos < len) {
        ans = prompt.substring(pos + 1, len + 1);
      } else {
        ans = prompt.substring(pos + 1, len + pos + 1);
      }
      wordTypes.push(ans);
    }
  }
  console.log('wordTypes', wordTypes);
  return wordTypes;
};

const buildStory = (wordInput, wordTypes, prompt) => {
  let story = prompt;
  // goes through word type array and replaces with user input in the prompt
  for (let i = 0; i < wordInput.length; i++) {
    story = story.replace(`[${wordTypes[i]}]`, `<span class="filledInWord">${wordInput[i]}</span>`);
  }
  return story;
};

const buildUnformattedStory = (wordInput, wordTypes, prompt) => {
  let story = prompt;
  // goes through word type array and replaces with user input in the prompt
  for (let i = 0; i < wordInput.length; i++) {
    story = story.replace(`[${wordTypes[i]}]`, `${wordInput[i]}`);
  }
  return story;
};

const generateImage = (prompt) => fetch('/generate-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt }),
})
  .then((response) => response.json())
  .then((data) => data.url);

const init = async () => {
  initScreenManagement();
  initImageManagement();

  // word types from story
  let wordTypes = [];
  let story;

  // List of elements that will be interfaced with
  els = elementDictionary([
    'startGameButton',
    'fillInBlanksForm',
    'fillInBlanksFormBlanks',
    'playAgainButton',
  ]);

  els.fillInBlanksForm.addEventListener('submit', fillInBlanksFormHandler);

  const startGame = () => {
    // loading page
    waitWithMessage('Getting Prompt...');
    // grabbing story from api
    fetchStory().then((response) => {
      console.log('response', response);
      // assign story to response
      story = response;
      // grab wordtypes
      wordTypes = getWordTypes(response);
      promptToFillInBlanks(wordTypes);
    }).catch(exitWithError);
  };

  els.startGameButton.onclick = startGame;
  els.playAgainButton.onclick = startGame;

  blanksFilledInCallback = (e) => {
    // const spans = e.map((f) => `<span class="filledInWord">${f}</span>`);
    // seeResults(`Let's all ${spans[0]} to the ${spans[1]}, let's all ${spans[0]} to the
    // ${spans[1]}. Let's all ${spans[0]} to the ${spans[1]}, to get ourselves a ${spans[2]}.`);

    // get string of completed story with user input, word types, and prompt
    seeResults(buildStory(e, wordTypes, story));

    // get an image
    waitForImageWithMessage('Generating a picture for the story...');
    generateImage(buildUnformattedStory(e, wordTypes, story))
      .then(setImageSrc)
      .catch(showImageError);
  };
};

window.onload = init;
