const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY=  "AIzaSyCsGDpgFakD5RwMe0txpkDqT3do-aWfSMk";

async function generateDefinitions (phrase, settings){
  console.log(settings)
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  if(settings[0] == true){
    let prompt = `Generate a defintion for: ${phrase}, in one sentence`;
    let result = await model.generateContent(prompt);
    document.getElementById("definitions").innerHTML = result.response.text().toString();
  }
  else{document.getElementById("definitions").innerHTML = ""}
  
  if(settings[1] == true){
    let prompt2 = `Generate 20 synonyms for the word: ${phrase}, in a comma separated list`;
    let result2 = await model.generateContent(prompt2);
    document.getElementById("synonyms").innerHTML = result2.response.text().toString();
  }
  else{document.getElementById("synonyms").innerHTML =""}

  if(settings[2]== true){
    let prompt3 = `Generate 7 antonyms for the word: ${phrase}, in a comma separated list`;
    let result3 = await model.generateContent(prompt3);
    document.getElementById("antonyms").innerHTML = result3.response.text().toString();
  }
  else{ document.getElementById("antonyms").innerHTML = ""}

}


chrome.storage.session.get('lastPhrase', ({ lastPhrase }) => {
  document.getElementById("selectedPhrase").innerHTML = lastPhrase;
  generateDefinitions(lastPhrase, [document.getElementById("showDef").checked, document.getElementById("showSyn").checked, document.getElementById("showAnt").checked])
})



chrome.storage.session.onChanged.addListener((change) => {
  const newWord = change['lastPhrase'];

  if (!newWord) {
    return;
  }

  document.getElementById("selectedPhrase").innerHTML  = newWord.newValue;
  generateDefinitions(newWord.newValue, [document.getElementById("showDef").checked, document.getElementById("showSyn").checked, document.getElementById("showAnt").checked])
});


document.getElementById("submitSearch").addEventListener("click", ()=>{
  document.getElementById("selectedPhrase").innerHTML = document.getElementById("searchBar").value.toString();
  generateDefinitions(document.getElementById("searchBar").value.toString(), [document.getElementById("showDef").checked, document.getElementById("showSyn").checked, document.getElementById("showAnt").checked]);
  document.getElementById("searchBar").value = ""

})