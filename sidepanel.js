const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY=  "AIzaSyCsGDpgFakD5RwMe0txpkDqT3do-aWfSMk";

async function generateSynonyms (phrase){
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt = `Generate a defintion for: ${phrase}, in one sentence`;
  let result = await model.generateContent(prompt);
  document.getElementById("definitions").innerHTML = result.response.text().toString();

  

  prompt = `Generate 20 synonyms for the word: ${phrase}, in a comma separated list`;
  result = await model.generateContent(prompt);
  document.getElementById("synonyms").innerHTML = result.response.text().toString();

  prompt = `Generate 7 antonyms for the word: ${phrase}, in a comma separated list`;
  result = await model.generateContent(prompt);
  document.getElementById("antonyms").innerHTML = result.response.text().toString();
  

}


chrome.storage.session.get('lastPhrase', ({ lastPhrase }) => {
  document.getElementById("selectedPhrase").innerHTML = lastPhrase;
  generateSynonyms(lastPhrase)
})



chrome.storage.session.onChanged.addListener((change) => {
  const newWord = change['lastPhrase'];

  if (!newWord) {
    return;
  }

  document.getElementById("selectedPhrase").innerHTML  = newWord.newValue;
  generateSynonyms(newWord.newValue)
});