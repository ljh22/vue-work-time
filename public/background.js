const openExtensionTabNextToCurrent = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currentTab = tabs[0];
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html'),
      index: currentTab ? currentTab.index + 1 : undefined
    });
  });
};

chrome.action.onClicked.addListener(() => {
  openExtensionTabNextToCurrent();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'open-work-time-tab') {
    openExtensionTabNextToCurrent();
  }
});
