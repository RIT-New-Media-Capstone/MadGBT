const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./apiResponse.js');
// Import OpenAI
require("dotenv");
//config();
require("openai");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/bundle.js': htmlHandler.getJS,
  '/logo.svg': htmlHandler.getLogo,
  '/generate-story': apiHandler.getApi,
  '/generate-image': apiHandler.generateImage,
  notFound: htmlHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const handlerFunction = urlStruct[parsedUrl.pathname];
  const { query } = parsedUrl;
  if (handlerFunction) {
    handlerFunction(request, response, query);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
