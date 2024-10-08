chrome.storage.session.get('lastPhrase', ({ lastPhrase }) => {
  document.getElementById("selectedPhrase").innerHTML = lastPhrase;
})


chrome.storage.session.onChanged.addListener((change) => {
  const newWord = change['lastPhrase'];

  if (!newWord) {
    return;
  }

  document.getElementById("selectedPhrase").innerHTML  = newWord.newValue;
});