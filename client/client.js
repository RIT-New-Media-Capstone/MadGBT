
// Global variables
let screens = {};
let els = {};
let blanksFilledInCallback;



// Handle API request
async function apiData(list = '[verb, noun, place, thing]') {
  const inputList = list;
  const openai = new OpenAI();
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [{role: "user", content: `Generate a madlibs prompt that uses each category from this list at least twice ${inputList}`}]
      }).then(res => {
          console.log(res.choices[0].message);
      });
      
      return response;

  } catch(error) {
      console.log(error);
  }
}

// Scroll to top of page
const scrollToTop = () => {
  window.scrollTo(0, 0);
};

// Create an object that whose keys point to corresponding document elements
const elementDictionary = (propNames, propNameToElementID) => {
  // If there is no no provided function translating the dictionary key name
  // to its corresponding element id, just use the key name as is
  const propNameToElementIdFinalized = propNameToElementID || ((e) => e);
  const dict = {};

  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i];
    dict[propName] = document.querySelector(`#${propNameToElementIdFinalized(propName)}`);
  }

  return dict;
};

// Switch to a screen by its name (as per the initialization of "screens" dictionary,
// this is the id minus the "Screens" at the end)
const setScreen = (name) => {
  // Avoid hiding all of the screens when there is no such screen with the given name
  if (!screens[name]) return;

  // Only the screen with the given name should be shown
  // https://stackoverflow.com/questions/33946567/iterate-over-values-of-object
  Object.keys(screens).forEach((key) => {
    screens[key].classList.toggle('activeScreen', key === name);
  });

  // Clear scroll level
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
  els.finishedStory.innerHTML = storyHTML;
  setScreen('results');
};

// Return to start screen to display a game-stopping error
const exitWithError = (message) => {
  els.errorMessage.innerText = message;
  setScreen('start');
};

// Validate "fill in the blanks" form input and call "blanksFilledInCallback"
// with the user's respectively-ordered inputs if successful
const fillInBlanksFormHandler = (evt) => {
  console.log("working");
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

const init = () => {
  
  // List of screens that will be seen during gameplay (entering game code, drawing, waiting, etc.)
  screens = elementDictionary([
    'start',
    'waiting',
    'fillInBlanks',
    'results',
  ], (e) => `${e}Screen`);

  // List of elements that will be interfaced with
  els = elementDictionary([
    'startGameButton',
    'errorMessage',
    'waitingMessage',
    'fillInBlanksForm',
    'fillInBlanksFormBlanks',
    'finishedStory',
    'playAgainButton',
  ]);

  els.fillInBlanksForm.addEventListener('submit', fillInBlanksFormHandler);

  // setScreen('fillInBlanks'); // Uncomment this line to debug a specific screen

  // THE CODE BELOW IS PLACEHOLDER BEHAVIOR

  els.startGameButton.onclick = () => promptToFillInBlanks(['Verb', 'Place', 'Thing', 'Test1', 'Test2']);
  els.playAgainButton.onclick = () => promptToFillInBlanks(['Verb', 'Place', 'Thing']);
  blanksFilledInCallback = (e) => {
    const spans = e.map((f) => `<span class="filledInWord">${f}</span>`);
    seeResults(`Let's all ${spans[0]} to the ${spans[1]}, let's all ${spans[0]} to the ${spans[1]}. Let's all ${spans[0]} to the ${spans[1]}, to get ourselves a ${spans[2]}.`);

    
    
  };
  
};

window.onload = init;
