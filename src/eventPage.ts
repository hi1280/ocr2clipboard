import { Rectangle } from '.';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: '/scripts/content-script.js' });
});

chrome.runtime.onMessage.addListener(async (rect: Rectangle, _, sendResponse) => {
  const base64Img = await chrome.tabs.captureVisibleTab().catch(e => {
    console.log(e);
  });
  const tabs = (await chrome.tabs.query({ active: true, currentWindow: true }).catch(e => {
    console.log(e);
  })) as chrome.tabs.Tab[];
  await chrome.tabs
    .sendMessage(tabs[0].id!, {
      base64Img,
      rect,
    })
    .catch(e => {
      console.log(e);
    });
  sendResponse(true);
  return true;
});
