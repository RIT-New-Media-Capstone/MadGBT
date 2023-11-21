const axios = require('axios')
//import OpenAI from "openai";

const testResponse = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html'});
    res.end(JSON.stringify({ message: "Hello this api endpoint has been reached."}));
}

const getAPI = async (req, res) => {
    try {
        const apiKey = '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';
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
        const requestData = {
            prompt: 'Hello World!',
            max_tokens: 150,
        }
        
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        });
    
        const responseData = response.data.choices[0].text;
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({data: responseData}));
    } catch (error) {

      console.error('Error making API request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message}));
    }

}


module.exports = {
 getAPI,
 testResponse,
}