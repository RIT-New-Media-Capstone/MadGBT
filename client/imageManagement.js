const {
  elementDictionary,
  setElDictItemVisible,
} = require('./elementDictionary.js');

let els = {};
let storyImageStates = {};

// Switch between showing the generated image, its "loading" message, or its error message
const setImageState = (state) => {
  setElDictItemVisible(storyImageStates, 'activeStoryImage', state);
};

// Indicate waiting for generated image with message
const waitForImageWithMessage = (message) => {
  els.waitingStoryImageMessage.innerText = message;
  setImageState('waiting');
};

// Set source of generated image and show it
const setImageSrc = (image) => {
  els.storyImage.src = image;
  setImageState('show');
};

const showImageError = (message) => {
  els.storyImageErrorMessage.innerText = message;
  setImageState('error');
};

const initImageManagement = () => {
  // List of elements that will be interfaced with
  els = elementDictionary([
    'waitingStoryImageMessage',
    'storyImage',
    'storyImageErrorMessage',
  ]);

  // List of states for generated image widget
  storyImageStates = elementDictionary([
    'waiting',
    'show',
    'error',
  ], (e) => `${e}StoryImage`);
};

module.exports = {
  waitForImageWithMessage,
  setImageSrc,
  showImageError,
  initImageManagement,
};
