import { config } from "dotenv";
config();
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.API_KEY
});

async function apiData(list = '[verb, noun, place, thing]') {
    const inputList = list;
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{role: "user", content: `Generate a madlibs prompt that uses each category from this list at least twice ${inputList}`}]
    }).then(res => {
        console.log(res.choices[0].message);
    });
    return response;
}

module.exports = {
    apiData
}