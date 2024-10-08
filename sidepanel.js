const { GoogleGenerativeAI,SchemaType } = require("@google/generative-ai");

const API_KEY=  "AIzaSyCsGDpgFakD5RwMe0txpkDqT3do-aWfSMk";


chrome.storage.session.get('settings', ({ settings }) => {
  if(!settings){
    document.getElementById("showDef").checked = true;
    document.getElementById("showSyn").value = 16;
    document.getElementById("showAnt").value = 8;
  }
  else{
    document.getElementById("showDef").checked = settings[0];
    document.getElementById("showSyn").value = settings[1];
    document.getElementById("showAnt").value = settings[2];
  }
  setSettings([document.getElementById("showDef").checked, document.getElementById("showSyn").value, document.getElementById("showAnt").value])
})


function setSettings(settings){
  if(settings[1] > 16){settings[1] = 16;}
  if(settings[1] < 0){settings[1] = 0;}

  if(settings[2] > 8){settings[2] = 8;}
  if(settings[2] < 0){settings[2] = 0;}
  
  chrome.storage.session.set({ settings: settings });
}

async function generateDefinitions (phrase){
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  let setting = [true, 16, 8]
  chrome.storage.session.get('settings', ({ settings }) => {
    setting = [settings[0], settings[1], settings[2]]
  });
  const schema  = {
    description: "List of results",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        item: {
          type: SchemaType.STRING,
          description: "words",
          nullable: false,
        },
      },
      required: ["item"],
    },
  }
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" , 
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }}
  );

  console.log(setting)
  if(setting[0] == true){
    let prompt = `Generate a complex defintion for: ${phrase}, in one sentence`;
    let result = await model.generateContent(prompt);
    const obj = JSON.parse(result.response.text())
    document.getElementById("definitions").innerHTML = obj[0]["item"];
  }
  else{document.getElementById("definitions").innerHTML = ""}
  
  if(setting[1] > 0){
    let prompt2 = `Generate ${setting[1]} synonyms for the word: ${phrase}, and for each synonym, write a short definition`;
    let result2 = await model.generateContent(prompt2);
    const obj = JSON.parse(result2.response.text())

    document.getElementById("synonymList").innerHTML = ""
    for(let i =0; i < obj.length; i++){
      document.getElementById("synonymList").append(Object.assign(document.createElement('li'), {textContent: obj[i]["item"]}))
    }
  }
  else{document.getElementById("synonymList").innerHTML =""}

  if(setting[2] > 0){
    let prompt3 = `Generate ${setting[2]} antonyms for the word: ${phrase}, for each antonym, write a short definition`;
    let result3 = await model.generateContent(prompt3);
    
    const obj = JSON.parse(result3.response.text())

    document.getElementById("antonymList").innerHTML = ""
    for(let i =0; i < obj.length; i++){
      document.getElementById("antonymList").append(Object.assign(document.createElement('li'), {textContent: obj[i]["item"]}))
    }

  }
  else{ document.getElementById("antonymList").innerHTML = ""}

}


chrome.storage.session.get('lastPhrase', ({ lastPhrase }) => {
  document.getElementById("selectedPhrase").innerHTML = lastPhrase;
  generateDefinitions(lastPhrase);
})



chrome.storage.session.onChanged.addListener((change) => {
  const newWord = change['lastPhrase'];

  if (!newWord) {
    return;
  }

  document.getElementById("selectedPhrase").innerHTML  = newWord.newValue;
  generateDefinitions(newWord.newValue);
});


document.getElementById("submitSearch").addEventListener("click", ()=>{
  document.getElementById("selectedPhrase").innerHTML = document.getElementById("searchBar").value.toString();
  generateDefinitions(document.getElementById("searchBar").value.toString());
  document.getElementById("searchBar").value = ""
})


document.getElementById("submitSettings").addEventListener("click", ()=>{
  setSettings([document.getElementById("showDef").checked, document.getElementById("showSyn").value, document.getElementById("showAnt").value])
  if(document.getElementById("settingDropdown").classList.contains("dropdown-full")){
    document.getElementById("settingDropdown").classList.remove("dropdown-full");
  }
})

document.getElementById("openSettings").addEventListener("click", ()=>{
  if(document.getElementById("settingDropdown").classList.contains("dropdown-full")){
    document.getElementById("settingDropdown").classList.remove("dropdown-full");
  }
  else{
    document.getElementById("settingDropdown").classList.add("dropdown-full");
  }
})