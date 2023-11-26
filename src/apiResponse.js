const axios = require('axios');

const getApi = (req, res) => {
     // Make the API call to OpenAI
     
     const openaiApiKey = process.env.API_KEY;

     const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Generate a madlibs prompt that uses each category from this list at least twice [verb, noun, place, thing]',
          },
        ],
        temperature: 0.2,
        max_tokens: 350,
      };
axios.post('https://api.openai.com/v1/chat/completions', requestData, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`,
  },
})
.then(response => {
    // Handle the response from the OpenAI API
    const data = JSON.stringify(response.data.choices[0].message);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  })
  .catch(error => {
    // Handle errors
    res.end(error.message);
  });

}

module.exports = {
    getApi,
  };