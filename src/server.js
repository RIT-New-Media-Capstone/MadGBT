const express = require('express');
const bodyParser = require('body-parser');
const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./apiResponse.js');
// Import OpenAI
require('dotenv').config();
require('openai');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/style.css', htmlHandler.getCSS);
app.get('/bundle.js', htmlHandler.getJS);
app.get('/logo.svg', htmlHandler.getLogo);
app.get('/generate-story', apiHandler.getApi);
app.post('/generate-image', apiHandler.generateImage);
app.get('/', htmlHandler.getIndex);

app.listen(PORT, () => {
  console.clear();
  console.log(`Server listening on 127.0.0.1:${PORT}\n`);
});
