function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'web-app',
    title: 'Analyze word/phrase',
    contexts: ['selection']
  
  });
}
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.contextMenus.onClicked.addListener(async (data, tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
  chrome.storage.session.set({ lastPhrase: (data.selectionText).toString().trim() });
});